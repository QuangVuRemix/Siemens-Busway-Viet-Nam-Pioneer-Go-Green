using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StravaReport.Models
{
    public class GroupEvent
    {
        public int Id { get; set; }
        [JsonPropertyName("resource_state")] 
        public int ResourceState { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ClubId { get; set; }
        [JsonPropertyName("organizing_athlete")] 
        public Athlete OrganizingAthlete { get; set; }
        
        [JsonPropertyName("activity_type")] 
        public string ActivityType { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? RouteId { get; set; }
        public object Route { get; set; }
        public bool WomenOnly { get; set; }
        public bool Private { get; set; }

        [JsonPropertyName("skill_levels")] 
        public int SkillLevels { get; set; }
        public int Terrain { get; set; }

        [JsonPropertyName("upcoming_occurrences")]
        public List<DateTime> UpcomingOccurrences { get; set; }
        public string Zone { get; set; }
        public string Address { get; set; }
        public bool Joined { get; set; }

        [JsonPropertyName("start_latlng")] 
        public object StartLatlng { get; set; }

        public double TotalDistance { set; get; }
        public int TotalMovingTime { set; get; }
        public int TotalActivities { set; get; }
    }
}
