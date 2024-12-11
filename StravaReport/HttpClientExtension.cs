using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StravaReport
{
    internal static class HttpClientExtension
    {
        public static async Task<T> GetAsJsonAsync<T>(this HttpClient client, string url)
        {
            var rp = await client.GetStringAsync(url);

            return System.Text.Json.JsonSerializer.Deserialize<T>(rp, new System.Text.Json.JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            });
        } 
    }
}
