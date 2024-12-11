using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    internal class LeaderBoard
    {
        public string athlete_firstname { set; get; }
        public string athlete_lastname { set; get; }
        public double distance { set; get; }
        public double elev_gain { set; get; }
        public int moving_time { set; get; }
        public int num_activities { set; get; }
        public int rank { set; get; }

        public GroupEvent Group { set; get; }

    }

    internal class Response<T>
    {
        public T Data { set; get; }
    }
}
