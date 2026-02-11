import React from "react";
import { Link } from "react-router-dom";

export const MyTripCard = ({ item, index }) => {
  return (
    <Link to={`/view-trip/${item.id}`}>
      <div className="border rounded-lg hover:scale-105 transition-all hover:shadow-md h-[250px]">
        <img
          src="/placeholder.jpg"
          alt="Trip"
          className="rounded-t-md object-cover w-full h-[130px]"
        />
        <div className="p-3">
          <h2 className="font-bold text-lg">
            {item?.userSelection?.location}
          </h2>
          <h2 className="text-sm text-gray-500">
            {item?.userSelection?.noOfDays} Days trip with{" "}
            {item?.userSelection?.budget} budget
          </h2>
        </div>
      </div>
    </Link>
  );
};
