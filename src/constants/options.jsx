
export const SelectTravelsList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveles in exploration",
    icon: '🏡',
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two traveles in tandem",
    icon: '💑',
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adv",
    icon: '🏡',
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekes",
    icon: '⛵',
    people: "5 to 10 people",
  },
];


export const selectBudgetOptions = [
    {
        id:1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon : '💸'
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon : '💰'
    },
    {
        id:3,
        title: 'Luxury',
        desc: 'Do not worry about costs',
        icon : '🚤'
    }
]

export const AI_PROMPT = 'Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Provide an itinerary in JSON format with the following structure: an array called "itinerary" where each element contains: "Day" (day number), and "Plan" (array of activities). Each activity should have: "Time" (e.g., "10:00 AM"), "PlaceName", "PlaceDetails", "PlaceImageUrl" (if available), "TicketPricing", "Rating", and "TimeTravel" (duration to spend there). Focus on creating a well-paced daily schedule with best times to visit each location.'