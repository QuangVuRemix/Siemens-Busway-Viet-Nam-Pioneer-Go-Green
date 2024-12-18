using StravaReport;
using StravaReport.Models;

Console.OutputEncoding = System.Text.Encoding.UTF8;

var config = System.Text.Json.JsonSerializer.Deserialize<Config>(File.ReadAllText("config.json"));

if (config.ExpireTime < DateTime.UtcNow)
{
    var auth = await StravaClient.RequestAccessToken(config.ClientID, config.ClientSecret, config.RefreshToken);
    config.RefreshToken = auth.RefreshToken;
    config.AccessToken = auth.AccessToken;
    config.ExpireTime = DateTimeOffset.FromUnixTimeSeconds(auth.ExpiresAt).UtcDateTime;

    File.WriteAllText("config.json", System.Text.Json.JsonSerializer.Serialize(config, new System.Text.Json.JsonSerializerOptions()
    {
        WriteIndented = true
    }));
}

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", config.AccessToken);
client.BaseAddress = new Uri("https://www.strava.com");
client.DefaultRequestHeaders.TryAddWithoutValidation("cookie", config.Cookie);
client.DefaultRequestHeaders.UserAgent.TryParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript");

var token = await StravaClient.GetCsrfToken(config.Cookie);
client.DefaultRequestHeaders.TryAddWithoutValidation("x-csrf-token", token);
client.DefaultRequestHeaders.TryAddWithoutValidation("x-requested-with", "XMLHttpRequest");
var clubID = config.ClubID;
var clubs = await client.GetAsJsonAsync<List<Club>>("/api/v3/athlete/clubs");
if (clubID == 0)
{
    foreach (var item in clubs)
    {
        Console.WriteLine($"{item.Id} - ClubName: {item.Name}");
    }
    Console.WriteLine("Vui lòng nhập ClubID");
    clubID = Int32.Parse(Console.ReadLine());
}


var leaderboard = await client.GetAsJsonAsync<Response<List<LeaderBoard>>>($"/clubs/{clubID}/leaderboard");
var groupEvents = await client.GetAsJsonAsync<List<GroupEvent>>($"/api/v3/clubs/{clubID}/group_events");
groupEvents = groupEvents.Where(x => x.UpcomingOccurrences?.Any(x => x > DateTime.UtcNow.AddDays(-1)) ?? false).ToList();

Dictionary<string, LeaderBoard> mapper = new Dictionary<string, LeaderBoard>();
Dictionary<string, Athlete> memberMapper = new Dictionary<string, Athlete>();


foreach (var item in leaderboard.Data)
{
    var key = $"{item.athlete_firstname} {item.athlete_lastname}".ToLower();
    mapper.Add(key, item);
}

foreach (var item in groupEvents)
{
    var members = await client.GetAsJsonAsync<List<Athlete>>($"/api/v3/group_events/{item.Id}/athletes");
    foreach (var member in members)
    {
        var key = $"{member.Firstname} {member.Lastname}".ToLower();

        if (mapper.TryGetValue(key, out var value))
        {
            value.Group = item;
        }
        else
        {
            Console.WriteLine($"Không thấy activity '{key}'");
        }

        memberMapper.TryAdd(key, member);
    }
}

var index = 0;

List<ReportGroup> report = new List<ReportGroup>();

foreach (var group in mapper.Values.GroupBy(x => x.Group?.Id).OrderByDescending(x => x.FirstOrDefault()?.Group?.TotalDistance))
{
    var groupInfo = group.FirstOrDefault()?.Group;
    var groupName = groupInfo?.Title;
    var totalDistance = groupInfo?.TotalDistance ?? 0;

    var reportGroup = new ReportGroup();
    reportGroup.Name = groupName;

    Console.WriteLine($"Group: {groupName} total distance: {(totalDistance / 1000).ToString("#.#")}km");

    foreach (var item in group.OrderBy(x => x.rank))
    {
        Console.WriteLine($"rank: {item.rank} name: {item.athlete_lastname} {item.athlete_firstname} distance: {item.distance}");
        var key = $"{item.athlete_firstname} {item.athlete_lastname}".ToLower();
        if (memberMapper.TryGetValue(key, out var member))
        {
            if (!member.Profile.StartsWith("http"))
                member.Profile = "https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/medium-bee27e393b8559be0995b6573bcfde897d6af934dac8f392a6229295290e16dd.png";

            var profile = await StravaClient.DownloadAsync(member.Profile);
             
            reportGroup.Members.Add(new ReportGroup.Member()
            {
                Distance = item.distance,
                ElevGain = item.elev_gain,
                FirstName = member.Firstname,
                LastName = member.Lastname,
                MovingTime = item.moving_time,
                Activities = item.num_activities,
                Profile = Convert.ToBase64String(profile),
                Rank = item.rank
            });
        }
    }

    reportGroup.TotalDistance = reportGroup.Members.Sum(x => x.Distance);
    reportGroup.TotalActivities = reportGroup.Members.Sum(x => x.Activities);
    reportGroup.TotalMovingTime = reportGroup.Members.Sum(x => x.MovingTime);

    if (reportGroup.Members.Count > 0)
        report.Add(reportGroup);

}

var reportAsJson = System.Text.Json.JsonSerializer.Serialize(new Report()
{
    ReportGroups = report,
    ReportTime = DateTime.UtcNow,
    Title = clubs.FirstOrDefault(x => x.Id == clubID).Name
}, new System.Text.Json.JsonSerializerOptions()
{
    WriteIndented = true,
    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
});
File.WriteAllText("report.json", reportAsJson); 

//Console.WriteLine("Hoàn thành, bấm phím bất kỳ để thoát");

//Console.ReadKey();