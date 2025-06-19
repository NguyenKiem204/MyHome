import React from "react";
import { Page } from "zmp-ui";
import BuildingSelector from "../components/BuildingSelector";
const buildings = [
  {
    id: 1,
    name: "Tòa nhà A",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    totalApartments: 120,
    image: "https://res.cloudinary.com/dozf7mhsv/image/upload/v1749919788/7c_utwibm.jpg",
  },
  {
    id: 2,
    name: "Tòa nhà B",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    totalApartments: 80,
    image: "https://res.cloudinary.com/dozf7mhsv/image/upload/v1749919748/4_yz804i.jpg",
  },
  {
    id: 3,
    name: "Tòa nhà C",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    totalApartments: 150,
    image: "https://res.cloudinary.com/dozf7mhsv/image/upload/v1749919836/8_xcwcao.jpg",
  },
];
const BuildingSelectorPage = () => {
  return (
    <Page>
      <BuildingSelector buildings={buildings} />
    </Page>
  );
};

export default BuildingSelectorPage;
