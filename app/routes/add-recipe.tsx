import { type MouseEvent, useState } from "react";
import { Form } from "@remix-run/react";
import localforage from "localforage";
import { set } from "lodash";
import { useEatWhat } from "../hooks/use-eat-what";
import { DishesList } from "../components/dish-list";
import { cornerConfirm } from "cornercss";

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
      .then(() => {
        cornerConfirm({
          title: "提示",
          content: "保存成功",
        });
      })
      .catch(() => {
        cornerConfirm({
          title: "提示",
          content: "保存失败",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  return (
    <div className="flex gap-[30px]">
      {choices.map(({ meal: { label, value }, dishes }) => {
        return (
          <Form method="post" key={value} onSubmit={handleSubmit}>
            <fieldset className="p-[20px] w-[500px]">
              <legend>{label}吃啥</legend>
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
