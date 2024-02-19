import { Text } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";

function PrintHeader() {
  const user = useSelector((state) => state.sessions.authUser);

  return (
    <div
      style={{
        width: "100%",
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
      }}
    >
      <div>
        <img
          src="./black-1.svg"
          height="84px"
          width="auto"
          alt=""
          style={{ marginRight: 14 }}
        />
        <Text size="sm" weight={600} mt={6}>
          Commission Nationale de Lutte contre la Fraude Minière
        </Text>
        <Text size="sm" color="dimmed">
          {user?.region.region}
        </Text>
      </div>

      <div style={{ textAlign: "end" }}>
        <Text size="sm">+243 {user?.phone}</Text>
        <Text size="sm">
          Soumis par {user?.first_name?.concat(" ", user?.last_name)}
        </Text>
        <Text size="sm" color="dimmed">
          {" "}
          le {new Date().toLocaleString("vh")}
        </Text>
      </div>
    </div>
  );
}

export default PrintHeader;
