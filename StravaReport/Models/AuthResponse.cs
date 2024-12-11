using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    internal class AuthResponse
    { 
        [JsonPropertyName("access_token")]
        public string AccessToken { set; get; }

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { set; get; }

        [JsonPropertyName("expires_at")]
        public long ExpiresAt { set; get; }
    }
}
