namespace StravaReport.Models
{
    public class Athlete
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int ResourceState { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public GroupEvent Group { set; get; }
        public string Profile { set; get; }
    }
}
