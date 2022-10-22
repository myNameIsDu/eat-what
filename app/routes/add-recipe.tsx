import { type MouseEvent, useState } from "react";
import { Form } from "@remix-run/react";
import localforage from "localforage";
import { set } from "lodash";
import { useEatWhat } from "../hooks/use-eat-what";
import { DishesList } from "../comonent/dish-list";

type CollectedType = {
  meal: string;
  dishes: string[];
};

export default function AddRecipe() {
  const { choices } = useEatWhat();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    let collected = {};
    for (const [key, value] of formData.entries()) {
      set(collected, key, value);
    }
    const newChoices = choices.map((v) => {
      if (v.meal.value === (collected as CollectedType).meal) {
        return {
          meal: v.meal,
          dishes: (collected as CollectedType).dishes,
        };
      }
      return v;
    });
    setIsSaving(true);
    localforage
      .setItem("eatWhat", newChoices)
      .catch(() => {
        alert("保存失败");
      })
      .finally(() => {
        setIsSaving(false);
        alert("保存成功");
      });
  };
  return (
    <div className="flex">
      {choices.map(({ meal: { label, value }, dishes }) => {
        return (
          <Form method="post" key={value} onSubmit={handleSubmit}>
            <fieldset className="p-[30px]">
              <legend>今天{label}吃啥</legend>
              <label className="mr-[10px] w-[60px]" htmlFor="meal">
                meal
              </label>
              {/**
               *  disable 的 空间不会出现在 formData 中所以使用 readOnly
               *  https://stackoverflow.com/questions/1355728/values-of-disabled-inputs-will-not-be-submitted
               */}
              <input
                style={{ border: "none", outline: "none" }}
                type="text"
                name="meal"
                value={value}
                readOnly
              />
              <br />
              <br />
              <DishesList dishes={dishes} />
              <button disabled={isSaving} className="ml-[70px]">
                保存
              </button>
            </fieldset>
          </Form>
        );
      })}
    </div>
  );
}
