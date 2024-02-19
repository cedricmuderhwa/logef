import { Card, Grid, Tabs, Text } from "@mantine/core";
import React from "react";
import { BsPeople, BsPinMapFill, BsShieldExclamation } from "react-icons/bs";
import { useSelector } from "react-redux";
import DisplayAviseur from "../../components/DisplayAviseur";
import SettingUsers from "../../components/SettingUsers";

function Users() {
  const loggedInUser = useSelector((state) => state.sessions.authUser);

  return (
    <div style={{ padding: "8px 14px 8px 14px" }}>
      <Grid gutter="sm">
        <div className="headerMainPage">
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <BsPeople fontSize={18} style={{ marginRight: 8 }} /> Utilisateurs
          </p>
          <span className="rightSection">
            <Text size="xs" color="blue">
              <BsPinMapFill
                size={18}
                style={{ marginBottom: -4, marginRight: 8 }}
              />
              {loggedInUser?.region?.region}
            </Text>
          </span>
        </div>
      </Grid>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <Card>
            <Tabs variant="outline" defaultValue="user">
              <Tabs.List>
                {/* <Tabs.Tab value='region' icon={<BsMap style={{marginRight: 8}} /> } ><div style={{display: 'inline-flex', alignItems: 'center'}}>Gestion des regions</div></Tabs.Tab> */}
                <Tabs.Tab
                  value="user"
                  icon={<BsPeople style={{ marginRight: 4 }} />}
                >
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    Gestion des utilisateurs
                  </div>
                </Tabs.Tab>
                <Tabs.Tab
                  value="permission"
                  icon={<BsShieldExclamation style={{ marginRight: 4 }} />}
                >
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    {" "}
                    Aviseurs occasionnels
                  </div>
                </Tabs.Tab>
              </Tabs.List>

              {/* <Tabs.Panel value="region" pt="xs">
                                <SettingRegion />
                            </Tabs.Panel> */}

              <Tabs.Panel value="user" pt="xs">
                <SettingUsers />
              </Tabs.Panel>

              <Tabs.Panel value="permission" pt="xs">
                <DisplayAviseur />
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Users;
