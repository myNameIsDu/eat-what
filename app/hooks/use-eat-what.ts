import { useState, useEffect } from "react";
import localforage from "localforage";

export const meals = [
  { value: "lunch", label: "午饭" },
  { value: "dinner", label: "晚饭" },
  { value: "supper", label: "夜宵" },
] as const;

const defaultStorage = [
  {
    meal: { value: "lunch", label: "午饭" },
    dishes: [],
  },
  {
    meal: { value: "dinner", label: "晚饭" },
    dishes: [],
  },
  {
    meal: { value: "supper", label: "夜宵" },
    dishes: [],
  },
];

export interface MealDataItem {
  meal: typeof meals[number];
  dishes: string[];
}
export function useEatWhat() {
  const [choices, setChoices] = useState<MealDataItem[]>([]);
  useEffect(() => {
    localforage.getItem("eatWhat").then((added) => {
      setChoices((added || defaultStorage) as MealDataItem[]);
    });
  }, []);
  return {
    choices,
  };
}
