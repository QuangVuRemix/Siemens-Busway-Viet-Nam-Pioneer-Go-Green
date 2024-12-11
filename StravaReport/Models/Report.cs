using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    class Report
    {
        public DateTime ReportTime { set; get; }
        public List<ReportGroup> ReportGroups { set; get; }
        public string Description { set; get; }
        public string Title { set; get; }
    }

    internal class ReportGroup
    {
        public string Name { set; get; }
        public double TotalDistance { set; get; }
        public int TotalMovingTime { set; get; }
        public int TotalActivities { set; get; }
        public List<Member> Members { set; get; } = new List<Member>();

        public class Member
        {
            public int Rank { set; get; }
            public string LastName { set; get; }
            public string FirstName { set; get; }
            public string Name => $"{LastName} {FirstName}".Trim();

            public double Distance { set; get; }
            public int Activities { set; get; }
            public double ElevGain { set; get; }
            public int MovingTime { set; get; }
            public string Profile { set; get; }
        }
    }
}
