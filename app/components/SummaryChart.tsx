import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Text } from "react-native-paper";

//get the whole week
function getWeekDates(weekOffset = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    week.push(`${yyyy}-${mm}-${dd}`);
  }
  return week;
}

type data = {
  day: string;
  total_water: number;
};

type ChartItem = {
  label: string;
  value: number;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  return `${day} ${month} `;
}

function getWeekInfo(offset: number) {
  const weekDates = getWeekDates(offset);

  return {
    start: weekDates[0],
    end: weekDates[6],
    startFmt: formatDate(weekDates[0]),
    endFmt: formatDate(weekDates[6]),
  };
}

function getWeekLabel(offset: number) {
  if (offset === 0) return "This Week";
  if (offset === -1) return "Last Week";
  return "";
}

export default function SummaryChart({
  prop = "Highlights",
}: {
  prop: string;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [values, setValues] = useState<ChartItem[]>([]);
  const [chartKey, setChartKey] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const MAX_OFFSET = 0; // can't go to future
  const MIN_OFFSET = -2; // only 2 weeks back

  const Weeks = getWeekInfo(weekOffset);
  const title = getWeekLabel(weekOffset);

  useEffect(() => {
    axios
      .get(
        `https://leafmebe-1.onrender.com/api/water/weekly?offset=${weekOffset}`
      )
      .then((res) => {
        const sqlRows = res.data;
        console.log(sqlRows);

        const weekDates = getWeekDates(weekOffset);

        //clean to date: value format

        const map: Record<string, number> = {};
        sqlRows.forEach((r: data) => {
          map[r.day] = r.total_water;
        });
        console.log(map);

        //assign value for the whole week

        const today = new Date();
        const cleaned = weekDates.map((date) => {
          const isFuture =
            weekOffset === 0 && new Date(date + "T00:00:00") > today;
          return {
            date,
            value: isFuture ? 0 : map[date] ?? 0,
          };
        });
        console.log("cleaned: ", cleaned);

        const weeks = cleaned.map((value) => {
          return value.date;
        });

        console.log("weeks", weeks);

        //formatting for bar chart

        const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const chartData = cleaned.map((item, index) => ({
          value: item.value,
          label: weekNames[new Date(item.date).getDay()],
          onPress: () => setSelectedIndex(index),
        }));

        setValues(chartData);
        setChartKey((prev) => prev + 1);
        console.log("NEW CHART DATA:", chartData);
      })
      .catch((err) => console.log(err));
  }, [weekOffset]);

  return (
    <View style={{ gap: 10 }}>
      <Text
        style={{
          fontWeight: "900",
          fontSize: 25,
          color: "white",
        }}
      >
        {prop}
      </Text>
      <View
        style={{
          padding: 20,
          backgroundColor: "#222",
          borderRadius: 20,
          shadowColor: "#00e676",
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View>
          <Text
            style={{
              color: "#C7C7C7",
              fontSize: 15,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Weekly Water Saved
          </Text>
          <Text style={{ color: "#C7C7C7", fontSize: 15, fontWeight: "bold" }}>
            {weekOffset === -2
              ? `${formatDate(Weeks.start)}– ${formatDate(Weeks.end)}`
              : `${title} (${formatDate(Weeks.start)}– ${formatDate(
                  Weeks.end
                )})`}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center", // center horizontally
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <BarChart
            key={chartKey}
            data={values}
            barWidth={26}
            barBorderRadius={8}
            noOfSections={3}
            spacing={15}
            frontColor="#0648ffff"
            barStyle={{ borderRadius: 10 }}
            animationDuration={300}
            xAxisLabelTextStyle={{
              color: "#d0d0d0",
              fontSize: 13,
              fontWeight: "500",
            }}
            isAnimated
            yAxisColor="rgba(255,255,255,0.15)"
            yAxisTextStyle={{ color: "#aaa", fontSize: 12 }}
            rulesColor="rgba(255,255,255,0.1)"
            dashGap={2}
            dashWidth={3}
            yAxisExtraHeight={40}
            minHeight={1}
            renderTooltip={(item: { value: number }, index: number) => {
              if (index !== selectedIndex) return null;
              return (
                <View
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 6,
                    backgroundColor: "#1f1f1f",
                    borderWidth: 1,
                    borderColor: "#00c97f",
                    marginLeft: -20,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    {item.value} ml
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <FontAwesome6
            name="circle-arrow-left"
            size={35}
            color="#C7C7C7"
            onPress={() => {
              if (weekOffset > MIN_OFFSET) setWeekOffset(weekOffset - 1);
            }}
          />
          <FontAwesome6
            name="circle-arrow-right"
            size={35}
            color="#C7C7C7"
            disabled={weekOffset === 0}
            onPress={() => {
              if (weekOffset < MAX_OFFSET) setWeekOffset(weekOffset + 1);
            }}
          />
        </View>
      </View>
    </View>
  );
}
