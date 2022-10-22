import { useState, Fragment, type MouseEvent } from "react";
interface DishesListPropsType {
  dishes: string[];
}
export function DishesList({ dishes }: DishesListPropsType) {
  const [list, setList] = useState(() => {
    if (dishes.length) {
      // 根据 dishes 长度生成 [0,1,2,3] 的 list
      return new Array(dishes.length).fill(0).map((v, i) => i);
    }
    return [0];
  });

  const handleSubtract = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const index = target.dataset.index;
      const newList = [...list];
      index && newList.splice(Number(index), 1);
      setList(newList);
    }
  };
  const handleAdd = () => {
    setList([...list, list.at(-1)! + 1]);
  };
  return (
    <>
      {list.map((v, i) => {
        const onlyOne = list.length === 1;
        return (
          <Fragment key={v}>
            <label className="mr-[10px] w-[60px]" htmlFor="choice">
              option
            </label>
            <input
              defaultValue={dishes[i]}
              name={`dishes[${i}]`}
              required
              max={100}
              className="w-[300px] mr-[20px]"
              type="text"
            />
            {!onlyOne && (
              <>
                <button type="button" data-index={i} onClick={handleSubtract}>
                  -
                </button>
              </>
            )}
            <br />
            <br />
          </Fragment>
        );
      })}
      <button type="button" className="ml-[70px]" onClick={handleAdd}>
        +
      </button>
      <br />
      <br />
    </>
  );
}
