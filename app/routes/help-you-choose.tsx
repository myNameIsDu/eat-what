import { useState, type ChangeEvent, useRef, Fragment } from "react";
import { useEatWhat } from "../hooks/use-eat-what";

// 参考  https://zhuanlan.zhihu.com/p/60193908
class Cubic {
  px3: number;
  px2: number;
  px1: number;
  py3: number;
  py2: number;
  py1: number;
  epsilon: number;
  constructor(a: number, b: number, c: number, d: number) {
    this.px3 = 3 * a;
    this.px2 = 3 * (c - a) - this.px3;
    this.px1 = 1 - this.px3 - this.px2;
    this.py3 = 3 * b;
    this.py2 = 3 * (d - b) - this.py3;
    this.py1 = 1 - this.py3 - this.py2;
    this.epsilon = 1e-7; // 目标精度
  }

  getX(t: number) {
    return ((this.px1 * t + this.px2) * t + this.px3) * t;
  }

  getY(t: number) {
    return ((this.py1 * t + this.py2) * t + this.py3) * t;
  }

  solve(x: number) {
    if (x === 0 || x === 1) {
      // 对 0 和 1 两个特殊 t 不做计算
      return this.getY(x);
    }
    let t = x;
    for (let i = 0; i < 8; i++) {
      // 进行 8 次迭代
      let g = this.getX(t) - x;
      if (Math.abs(g) < this.epsilon) {
        // 检测误差到可以接受的范围
        return this.getY(t);
      }
      let d = (3 * this.px1 * t + 2 * this.px2) * t + this.px3; // 对 x 求导
      if (Math.abs(d) < 1e-6) {
        // 如果梯度过低，说明牛顿迭代法无法达到更高精度
        break;
      }
      t = t - g / d;
    }
    return this.getY(t); // 对得到的近似 t 求 y
  }
}

let c = new Cubic(0.42, 0, 0.58, 1.0);

// 参考 https://juejin.cn/post/7017256886697197604
function animate(draw: (process: number) => void, duration = 4000) {
  let start = performance.now();
  let requestId: number;

  requestId = requestAnimationFrame(function step(time) {
    // process 从 0 增加到 1
    let process = (time - start) / duration;

    if (process > 1) {
      process = 1;
    }

    draw(process); // 绘制

    if (process < 1) {
      requestId = requestAnimationFrame(step);
    }
  });

  return () => {
    cancelAnimationFrame(requestId);
  };
}
const lapsNumber = 8;

export default function HelpYouChoose() {
  const { choices } = useEatWhat();
  const [selectedMeal, setSelectedMeal] = useState("");
  const isProcess = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  const onSelect = (item: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = item.target.value;
    setSelectedMeal(nextValue);
  };
  const dishes =
    choices.find(({ meal }) => meal.value === selectedMeal)?.dishes || [];
  const handleChoose = () => {
    if (isProcess.current) return;
    isProcess.current = true;
    const max = dishes.length;
    if (max > 1) {
      const choseDishIndex = Math.floor(Math.random() * max);
      const round = max * lapsNumber + choseDishIndex;
      animate((process) => {
        const current = Math.floor(c.solve(process) * round);
        setActiveIndex(current % max);

        if (current >= round) {
          isProcess.current = false;
          setTimeout(() => {
            alert(dishes[choseDishIndex]);
          }, 500);
        }
      }, max * 1000);
    } else {
      alert(dishes[0]);
    }
  };
  return (
    <div className="pt-[50px] flex flex-col items-center">
      <select
        value={selectedMeal}
        onChange={onSelect}
        className="w-[300px] mb-[30px]"
      >
        <option value="" hidden>
          选择你的食谱
        </option>
        {choices.map(({ meal: { label, value } }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <br />
      {dishes.length ? (
        <>
          <div className="w-[500px] flex flex-wrap">
            {dishes.map((v, i) => {
              return (
                <Fragment key={v}>
                  <br />
                  <button
                    style={{
                      backgroundColor:
                        i === activeIndex ? "rgb(173 171 171)" : "inherit",
                    }}
                    className="h-[50px]  !text-left text-[18px] bg-clip-border	rounded-[5px]"
                  >
                    {v}
                  </button>
                  <br />
                </Fragment>
              );
            })}
          </div>
          <br />
          <button
            onClick={handleChoose}
            type="button"
            className="cursor-pointer"
          >
            选一个
          </button>
        </>
      ) : null}
    </div>
  );
}
