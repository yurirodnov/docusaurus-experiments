import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "open-api/OMG/Something weird/pupupupu/petstore/sample-api",
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "open-api/OMG/Something weird/pupupupu/petstore/get-users",
          label: "Get list of users",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
