using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    internal class Activity
    {
        public int ResourceState { get; set; }
        public Athlete Athlete { get; set; }
        public string Name { get; set; }
        public double Distance { get; set; }
        public int MovingTime { get; set; }
        public int ElapsedTime { get; set; }
        public double TotalElevationGain { get; set; }
        public string Type { get; set; }
        public string SportType { get; set; }
        public int WorkoutType { get; set; }

        public GroupEvent Group { set; get; }
    }
}
