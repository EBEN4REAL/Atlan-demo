export const Cron = [
  {
    id: "none",
    label: "None",
    cron: "",
  },
  {
    id: "hourly",
    label: "Hourly",
    cron: "0 * * * *",
  },
  {
    id: "daily",
    label: "Daily",
    cron: "0 0 * * *",
  },
  {
    id: "weekly",
    label: "Weekly",
    cron: "0 0 * * 0",
  },
  //   {
  //     id: "weekday",
  //     label: "Weekdays",
  //     cron: "0 0 * * 1-5",
  //   },
  //   {
  //     id: "monthly",
  //     label: "Monthly",
  //     cron: "0 0 1 * *",
  //   },
  //   {
  //     id: "quarterly",
  //     label: "Quarterly",
  //     cron: "0 0 1 */3 *",
  //   },
  {
    id: "advanced",
    label: "Advanced",
    cron: "0 0 * * *",
  },
];
