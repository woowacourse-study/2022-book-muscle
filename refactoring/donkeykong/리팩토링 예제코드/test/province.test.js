import sampleProvinceData from "../data/sampleProvineData";
import Province from "../Province";

describe("province", () => {
  let asia;
  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });
  test("shortfall", () => {
    expect(asia.shortfall).toBe(5);
  });

  test("profit", () => {
    expect(asia.profit).toBe(230);
  });

  test("change production", () => {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });

  test("zero demand", () => {
    asia.demand = 0;
    expect(asia.shortfall).toBe(-25);
    expect(asia.profit).toBe(0);
  });

  test("negative demand", () => {
    asia.demand = -1;
    expect(asia.shortfall).toBe(-26);
    expect(asia.profit).toBe(-10);
  });
});

describe("no producers", () => {
  let noProducers;
  beforeEach(() => {
    const data = {
      name: "No producers",
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });
  test("shortfall", () => {
    expect(noProducers.shortfall).toBe(30);
  });
  test("profit", () => {
    expect(noProducers.profit).toBe(0);
  });
});
