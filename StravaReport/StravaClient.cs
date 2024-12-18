using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using StravaReport.Models;

namespace StravaReport
{
    internal class StravaClient
    {
        static string ExtractCsrfToken(string html)
        {
            // Define the regular expression pattern
            string pattern = @"<meta name=""csrf-token"" content=""([^""]+)"" \/>";

            // Create a regex object
            Regex regex = new Regex(pattern);

            // Match the pattern against the HTML string
            Match match = regex.Match(html);

            // If a match is found, return the captured token, otherwise return null
            return match.Success ? match.Groups[1].Value : null;
        }

        const string USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
        public static async Task<string> GetCsrfToken(string cookie)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://www.strava.com");
                client.DefaultRequestHeaders.TryAddWithoutValidation("cookie", cookie);
                client.DefaultRequestHeaders.UserAgent.TryParseAdd(USER_AGENT);

                var rp = await client.GetStringAsync("/dashboard");

                return ExtractCsrfToken(rp);
            }
        }

        public static async Task<AuthResponse> RequestAccessToken(string clientId, string clientSecret, string refreshToken)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://www.strava.com");
                client.DefaultRequestHeaders.UserAgent.TryParseAdd(USER_AGENT);

                var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(new { 
                    client_id = clientId, 
                    client_secret = clientSecret,
                    grant_type="refresh_token",
                    refresh_token = refreshToken
                }));
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var rp = await client.PostAsync("/oauth/token", content);
                rp.EnsureSuccessStatusCode();

                var responseContent = await rp.Content.ReadAsStringAsync();
                return System.Text.Json.JsonSerializer.Deserialize<AuthResponse>(responseContent, new System.Text.Json.JsonSerializerOptions()
                {
                    PropertyNameCaseInsensitive = true
                });
            }
        }

        public static async Task<byte[]> DownloadAsync(string url)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.UserAgent.TryParseAdd(USER_AGENT);

                var reponse = await client.GetAsync(url);
                try
                {
                    var buffer = await reponse.Content.ReadAsByteArrayAsync();

                    return buffer;
                }
                catch
                {
                    return null;
                } 
            }
        }
    }
}
