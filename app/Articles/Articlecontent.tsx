import { ImageSourcePropType } from "react-native";

const plant1 = require("../../assets/images/plants.jpg");
const plant2 = require("../../assets/images/water.jpg");
const plant3 = require("../../assets/images/waters.jpg");
const plant4 = require("../../assets/images/rot.png");

export type ArticleType = {
  id: string;
  propTitle: string;
  propSubTitle: string;

  contentTitle: string;

  contentHeader_1?: string;
  contentHeader_2?: string;
  contentHeader_3?: string;

  content_1?: string;
  content_2?: string;
  content_3?: string;
  content_4?: string;

  propImage: ImageSourcePropType;
};

export const articlesData: ArticleType[] = [
  {
    id: "1",
    propTitle: "Learn the Basics of Taking Care of Plants",
    propSubTitle: "Simple habits to keep your plants thriving",
    contentTitle: "Plant Care 101 Article",

    contentHeader_1: "Start with the Right Soil",
    contentHeader_2: "Understand Light Levels",
    contentHeader_3: "Watering Basics",

    content_1: `Starting your journey as a plant parent can feel overwhelming, but at its heart, plant care relies on a few fundamental principles. By mastering the basics of light, water, and soil, you can transform your home into a thriving indoor garden. Remember, successful plant care isn't about having a "green thumb"—it's about observation and consistency.`,

    content_2: `Healthy soil is the foundation of any thriving plant, so make sure the soil drains well and doesn’t stay soggy. The soil, or potting mix, is much more than just dirt; it's the anchor for your plant and the medium through which it absorbs water and nutrients, and for most indoor plants, the golden rule is drainage. 
    
Standard garden soil is often too dense and compacts easily, preventing oxygen from reaching the roots, so always opt for commercial potting mix which is lighter and includes ingredients like peat moss, perlite, or coconut coir to improve aeration.

For plants prone to rot, such as succulents and cacti, amend your standard potting mix with extra perlite or coarse sand to ensure superior drainage. Crucially, always use pots with drainage holes at the bottom because without them, excess water collects at the base and guarantees root rot.`,

    content_3: `Different plants need different sunlight conditions, so you must learn whether your plant needs full sun, partial shade, or low light. Light is the fuel for your plant, powering the process of photosynthesis, and misunderstanding a plant's light needs is a common cause of distress.
      
Plants that require Full Sun need six or more hours of direct, intense sunlight daily, and they are best placed in South or Southwest- facing windows in the Northern Hemisphere; these include cacti, succulents, and citrus plants.Most common houseplants thrive in Bright Indirect light, which means they get plenty of bright ambient light but the sun's rays never directly hit the leaves, so they do well near an East or West-facing window or a few feet back from a sunny one, such as Pothos or Ficus.

Finally, Low Light plants, like Snake Plants and ZZ Plants, can tolerate very little natural light, usually ambient or distant light found in North-facing windows or deep within a room.`,

    content_4: `Overwatering is the most common mistake new plant owners make, so you should only water when the top soil feels dry. Many beginner plant owners water on a fixed schedule, such as "every Sunday," instead of watering based on the plant's actual needs, and this leads directly to the most common plant killer: root rot. 
      
To avoid this, use the Finger Test by sticking your index finger one to two inches deep into the soil before watering; if it feels dry, it's time to water, but if it feels damp, wait a few more days. When you do water, you must Saturate and Drain by watering thoroughly until you see the water run out of the drainage holes, which ensures the entire root ball is saturated, and then you must discard any water collected in the saucer after about 30 minutes.

Be aware that plants need less water in the dormant winter months and more water during active growth in spring and summer, which is a necessary Seasonal Adjustment.`,

    propImage: plant1,
  },

  {
    id: "2",
    propTitle: "Signs Your Plant Is Overwatered vs Underwatered",
    propSubTitle: "Know the difference and save your plant",
    contentTitle: "Overwatered vs Underwatered Article",

    contentHeader_1: "Overwatering Symptoms",
    contentHeader_2: "Underwatering Symptoms",
    contentHeader_3: "How to Fix Each Problem",

    content_1: `Watering is the most crucial, and often the most confusing, aspect of indoor plant care because the symptoms of giving a plant too much water can sometimes look surprisingly similar to giving it too little. The key to successful plant parenthood lies in correctly diagnosing the problem before it causes irreversible damage, as the central difference is the soil—a wet wilt points to overwatering, while a dry wilt points to underwatering.`,

    content_2: `Overwatering occurs when the soil stays soggy for too long, suffocating the roots by displacing the oxygen they need to survive, which leads to root rot—the number one killer of houseplants. Overwatered plants often have yellow leaves, mushy stems, and fungus growing on soil. 
      
Specifically, the leaves will often turn uniformly yellow, starting with the older, lower leaves, and they may also feel soft and limp to the touch, and you might spot tiny water-soaked blisters or brown spots on the leaves (a condition called edema).

The plant will often wilt, even though the soil is wet, because the damaged roots can no longer take up water, and the soil itself may smell sour or rotten due to anaerobic bacterial growth, sometimes accompanied by mold or fungus gnats.`,

    content_3: `Underwatering is usually a less fatal and easier problem to fix, and it occurs when the plant is not receiving sufficient hydration and the soil becomes bone dry. Underwatered plants look dry, crispy, and their leaves may curl inward.
      
While they also wilt and droop like overwatered plants, the key differentiator is the soil—it will be rock-hard, dry, and often pull away from the sides of the pot. The leaves often turn brown and crispy, starting at the tips and edges, and the stems themselves can look brittle or shriveled.

A major indication is that the plant will perk up and regain its rigidity relatively quickly once it receives a deep, thorough watering.`,

    content_4: `The most important step for correcting both problems is to stop watering on a schedule and instead water based on the plant's actual moisture needs. 
    
Adjust your watering schedule based on soil moisture — this alone saves 80% of struggling plants. The finger test remains the best tool: stick your finger 1-2 inches deep into the soil; if it feels dry, water; if it feels damp, wait.

To fix an overwatered plant:
1. Stop watering immediately and move the plant to an area with better airflow and brighter (but not scorching) light to help the soil dry out faster.

2. If the plant is badly affected, gently remove it from the pot, trim away any mushy, slimy, black, or brown roots (root rot), and repot it into fresh, dry, well-draining soil.


To fix an underwatered plant:
1. Water the plant slowly and deeply until water drains freely from the bottom hole, making sure the entire root ball is saturated—a common fix is to let the pot sit in a basin of water for 30 minutes to soak it up from below.

2. Maintain a more consistent watering routine moving forward, ensuring the soil does not completely dry out for prolonged periods.`,

    propImage: plant2,
  },

  {
    id: "3",
    propTitle: "Why Water Sustainability Matters",
    propSubTitle: "Small changes, big global impact",
    contentTitle: "Water Sustainability Article",

    contentHeader_1: "Why Water Matters",
    contentHeader_2: "How Plants Help",
    contentHeader_3: "Everyday Habits to Adopt",

    content_1: `Water is the foundation of all life on Earth, yet the global supply of usable fresh water is surprisingly finite and unevenly distributed. 
      
As the world population grows and climate patterns become more volatile, practicing water sustainability is no longer an optional choice but a critical necessity.

By adopting mindful practices in our daily lives, we can ensure that this essential resource is available for future generations and maintain a healthy ecological balance.`,

    content_2: `Fresh water is one of the most limited resources on earth. Sustainable habits ensure long-term supply. Although our planet is covered in water, over 97% of it is saltwater, and nearly all of the remaining fresh water is locked up in ice caps, glaciers, or deep underground aquifers. 
    
This leaves less than 1% of the world's water readily accessible for human use, agriculture, and industry. When we overuse or pollute this tiny fraction, we jeopardize food security, public health, and ecosystem stability.

Sustainable water habits—like reducing consumption and preventing pollution—are essential to managing this precious resource responsibly and safeguarding its long-term supply for every living creature.`,

    content_3: `Plants naturally recycle moisture and improve environmental balance, even in urban areas. While managing water usage in the home is vital, understanding the role of plants in the water cycle provides a broader perspective on sustainability. 
      
Plants act as natural water filters and reservoirs; their root systems help rainwater soak into the ground rather than running off, which recharges local groundwater supplies.

Furthermore, through transpiration, plants release water vapor back into the atmosphere, contributing to local precipitation and cooling effects. In an urban environment, maintaining green spaces and choosing native, drought-tolerant plants minimizes irrigation needs while maximizing nature’s ability to manage water cycles effectively.`,

    content_4: `Collect rainwater, adjust watering frequency, and avoid unnecessary waste — small habits add up. The most impactful changes start with simple, conscious actions at home, especially in the kitchen, bathroom, and garden.

1. Water in the Garden: Install a rain barrel to collect rainwater for use in your garden and reduce your reliance on tap water. For houseplants and landscaping, always check the soil moisture before watering and aim to water deeply but infrequently to encourage strong, deep root growth, rather than shallow daily sprinkles.

2. Water in the Home: Fix leaky faucets and running toilets immediately, as small drips can waste thousands of gallons annually. Turn off the tap while brushing your teeth or scrubbing dishes, and choose water-efficient appliances.

3. Greywater Use (Where Possible): Consider simple systems to reuse "greywater"—the water from your shower, bath, and washing machine—for non-potable uses like flushing toilets or watering outdoor non-edible plants.`,

    propImage: plant3,
  },

  {
    id: "4",
    propTitle: "Singapore Humidity: Why Your Plants Rot",
    propSubTitle: "And how to keep them alive",
    contentTitle: "Singapore Humidity Article",

    contentHeader_1: "Why Humidity Causes Rot",
    contentHeader_2: "How to Improve Airflow",
    contentHeader_3: "Choosing the Right Soil Mix",

    content_1: `Singapore’s climate is a double-edged sword for houseplant enthusiasts. While the consistently warm temperatures promote year-round growth, the high relative humidity—often hovering between 70% and 90%—creates a challenging environment that makes plants highly susceptible to the deadly condition known as root rot. 

Root rot is not caused by a fungus or bacteria first, but by asphyxiation (suffocation), which then invites pathogens. Understanding the role of humidity in this process is the key to mastering tropical plant care and keeping your green friends alive and thriving.`,

    content_2: `Singapore’s humidity prevents soil from drying, causing roots to suffocate and rot. Most indoor plant roots require a balance of moisture and oxygen to function correctly. 
      
When you water a plant, the soil holds onto moisture, but the space between the soil particles should ideally be filled with air once the excess water has drained away. In a low-humidity environment, this happens quickly as water evaporates from the top of the soil.

However, in Singapore's constantly high humidity, the air is already saturated with moisture, significantly slowing down the evaporation rate from the soil surface. This means the soil stays wet for days, sometimes weeks, longer than it should. When the soil remains saturated, the air pockets are blocked by water, starving the roots of oxygen.

The suffocated roots begin to die, and it is these dead roots that become the perfect breeding ground for the water-borne fungal and bacterial pathogens that we commonly refer to as root rot.`,

    content_3: `Keep your plants in ventilated areas and avoid overcrowding them. Since you can't change Singapore’s outdoor humidity, you must control the environment directly around your plants to encourage moisture evaporation. Airflow is your best defense against rot.

1. Placement is Key: Move plants away from corners or tight shelves where air tends to stagnate. Place them near open windows, doorways, or in the middle of a well-trafficked room.

2. Use Fans: Running a small, oscillating fan near your plant collection for a few hours a day dramatically improves air circulation, which helps the moisture evaporate from the soil surface and the plant leaves.

3. Avoid Overcrowding: Ensure there is space between your plants. When plants touch, they trap humidity, and leaves stay wet, promoting fungal issues. Give each plant room to breathe.`,

    content_4: `The key to successful container gardening in a humid climate is to abandon dense, "all-purpose" potting soil and instead use an extremely chunky and porous mix to help roots breathe and prevent root rot. 

The strategy involves amending the mix by ensuring your potting medium consists of 50-70% chunky amendments rather than 100% potting soil, as these large particles create permanent air pockets. For essential materials, use components like perlite, pumice (volcanic rock), orchid bark (chunky wood chips), and LECA (lightweight expanded clay aggregate).

The Golden Test for the correct mix is that water should drain out of the bottom within seconds, leaving behind plenty of air space—this confirms quick water passage and maximizes the oxygen available to the roots.

This chunky mix prevents the soil from staying saturated, protecting the roots from suffocation, which is the initial cause of root rot.`,

    propImage: plant4,
  },
];
