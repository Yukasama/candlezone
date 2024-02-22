import { render, waitFor } from "@testing-library/react";
import { db } from "@/db";
import Page from "@/app/page";

jest.mock("@/db", () => ({
  stock: {
    findMany: jest.fn(() =>
      Promise.resolve(
        db.stock.findMany({
          select: {
            symbol: true,
            companyName: true,
            image: true,
            sector: true,
            exchange: true,
            mktCap: true,
          },
          orderBy: {
            mktCap: "desc",
          },
          take: 5,
        })
      )
    ),
  },
}));

describe("Page", () => {
  it("renders without crashing", async () => {
    render(await Page());
    await waitFor(() => {
      expect(db.stock.findMany).toHaveBeenCalled();
    });
  });
});
