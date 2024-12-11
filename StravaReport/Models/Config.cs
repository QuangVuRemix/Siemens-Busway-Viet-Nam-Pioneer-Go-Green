using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    internal class Config
    {
        public string AccessToken { set; get; }
        public string RefreshToken { set; get; }
        public DateTime ExpireTime { set; get; }
        public int ClubID { set; get; }
        public string Cookie { set; get; }
        public string ClientID { set; get; }
        public string ClientSecret { set; get; }
    }
}
