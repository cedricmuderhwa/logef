import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import {
  BsArrowCounterclockwise,
  BsCheck2,
  BsClockHistory,
  BsFolderPlus,
  BsPencilSquare,
  BsPersonPlus,
  BsSearch,
  BsShieldLock,
  BsX,
  BsXOctagonFill,
} from "react-icons/bs";
import { FaUserCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LoadUsers } from "../../hooks/fetchUser";
import { resetUserAccount, updateUser } from "../../redux/slices/users";
import FormUser from "../FormUser";
import FullPageLoader from "../FullPageLoader/FullPageLoader";
import SettingPermission from "../SettingPermission";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, onSort }) {
  const { classes } = useStyles();
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          {children === "-" ? null : (
            <Text weight={500} size="sm">
              {children}
            </Text>
          )}
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const keys = ["first_name", "last_name", "user_role", "email", "phone"];
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys.some((key) => item[key].toLowerCase().includes(query))
  );
}

function SettingUsers() {
  const usersState = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [permissionsVisible, setpermissionsVisible] = useState(false);

  const [isLoading, users] = LoadUsers();

  const [createVisible, setcreateVisible] = useState(false);
  const [editVisible, seteditVisible] = useState(false);
  const [filteblueData, setfilteblueData] = useState(users || []);
  const [selectedUser, setselectedUser] = useState();

  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  ).permissions;

  useEffect(() => {
    setfilteblueData(usersState);
    return () => {
      setfilteblueData([]);
    };
  }, [usersState, users]);

  const modals = useModals();

  const openConfirmModal = (e, data) =>
    modals.openConfirmModal({
      title: (
        <Text
          size="lg"
          weight={400}
          color="blue"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          Réinitialiser ce compte ?
        </Text>
      ),
      children: (
        <Text size="xs">
          Voulez-vous vraiment réinitialiser le compte de cet agent ? Veuillez
          confirmer
        </Text>
      ),
      zIndex: 201,
      labels: { confirm: "Réinitialiser", cancel: "Annuler" },
      confirmProps: {
        color: "blue",
        size: "xs",
        leftIcon: <BsClockHistory size={16} />,
      },
      cancelProps: { size: "xs" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        const res = await dispatch(resetUserAccount(data._id));
        if (res.payload?._id) {
          showNotification({
            color: "green",
            title: "Réussite",
            message: "Compte reinitialisé avec succés",
            icon: <BsCheck2 />,
          });
        }

        if (res.error) {
          showNotification({
            color: "red",
            title: "Echec",
            message: "Echec de reinitialisation du compte!",
            icon: <BsXOctagonFill />,
          });
        }
      },
    });

  // Here is where we design the data in the rows data
  const rows = filteblueData
    ?.slice(0)
    .reverse()
    .map((row) => (
      <tr key={row._id} style={{ cursor: "pointer" }}>
        {/* avatar */}
        <td>
          <Avatar color="gray">
            <FaUserCog size={20} />
          </Avatar>
        </td>

        {/* Names & skills */}
        <td>
          <h3 style={{ margin: 0, padding: 0 }}>
            {row?.first_name?.concat(" ", row?.last_name)}
          </h3>
          <p
            style={{
              textOverflow: "ellipsis",
              color: "blue",
              overflow: "hidden",
              fontSize: 12,
            }}
          >
            {row.quality}
          </p>
        </td>
        {/* contacts */}
        <td style={{ textAlign: "left" }}>
          <h3 style={{ margin: 0, padding: 0 }}>{row.phone}</h3>
          <p
            style={{
              textOverflow: "ellipsis",
              color: "GrayText",
              overflow: "hidden",
              fontSize: 12,
            }}
          >
            {row.email}
          </p>
        </td>
        {/* joining & status */}
        <td style={{ textAlign: "left" }}>
          <h3 style={{ margin: 0, padding: 0 }}>
            {new Date(row.createdAt).toLocaleString("vh")}
          </h3>
          <Badge
            variant="outline"
            radius="sm"
            size="xs"
            color={row.isAvailable ? "green" : "gray"}
          >
            {row.isAvailable ? "Disponible" : "indisponible"}
          </Badge>
        </td>
        {/* exit & reason */}
        <td style={{ textAlign: "left" }}>
          <h3
            style={{
              margin: 0,
              padding: 0,
              fontWeight: 600,
              color: "dodgerblue",
            }}
          >
            {row.last_session.createdAt
              ? new Date(row.last_session?.createdAt).toLocaleString("vh")
              : "N/A"}
          </h3>
          <p
            style={{
              textOverflow: "ellipsis",
              color: "GrayText",
              overflow: "hidden",
              fontSize: 12,
            }}
          >
            {row.last_session.createdAt
              ? row.last_session?.userAgent.split(")")[0].concat(")")
              : "N/A"}
          </p>
        </td>

        <td style={{ textAlign: "left" }}>
          <h3
            style={{
              margin: 0,
              padding: 0,
              fontWeight: 600,
              color: "dodgerblue",
            }}
          >
            {row?.service?.service_name}
          </h3>
          <p
            style={{
              textOverflow: "ellipsis",
              color: "GrayText",
              overflow: "hidden",
              fontSize: 12,
            }}
          >
            {row?.region?.region}
          </p>
        </td>
        {/* Events coveblue */}
        <td>
          <Switch
            size="md"
            color="blue"
            onLabel="ON"
            offLabel="OFF"
            defaultChecked={row.isActive ? true : false}
            onChange={(e) => handleDisable(e, row)}
          />
        </td>
        <td>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <ActionIcon
              color="blue"
              variant="light"
              style={{ marginRight: 8 }}
              onClick={() => {
                seteditVisible(true);
                setselectedUser(row);
              }}
            >
              <BsPencilSquare size={16} />
            </ActionIcon>
            <ActionIcon
              color="green"
              variant="light"
              style={{ marginRight: 8 }}
              onClick={() => {
                setpermissionsVisible(true);
                setselectedUser(row);
              }}
            >
              <BsShieldLock size={16} />
            </ActionIcon>
            {row?.isNewUser ? null : (
              <ActionIcon
                color="orange"
                variant="light"
                onClick={(e) => {
                  openConfirmModal(e, row);
                }}
              >
                <BsArrowCounterclockwise size={16} />
              </ActionIcon>
            )}
          </span>
        </td>
      </tr>
    ));

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setfilteblueData(filterData(users, value));
  };

  const handleDisable = (e, data) => {
    dispatch(
      updateUser({
        _id: data?._id,
        dataToSubmit: { isActive: !data?.isActive },
      })
    ).then((res) => {
      if (res.payload) {
        showNotification({
          color: "blue",
          title: "Success",
          message: `User ${
            res.payload.isActive ? "Enabled" : "Disabled"
          } successfully`,
          icon: <BsCheck2 />,
        });
      }

      if (res.error) {
        showNotification({
          color: "blue",
          title: "Error",
          message: "Disabling user failed...",
          icon: <BsX />,
        });
      }
    });
  };

  return (
    <div style={{ border: "1px solid #eaeaea", borderRadius: 4, padding: -14 }}>
      <Grid style={{ marginBottom: 7 }}>
        <Grid.Col span={12}>
          {userPermissions?.MODIFY_USERS_INFO ? (
            <Card>
              <div>
                <ScrollArea>
                  <div
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      leftIcon={<BsPersonPlus size={20} />}
                      onClick={() => setcreateVisible(true)}
                      color="blue"
                      style={{ marginRight: 14 }}
                    >
                      Nouvel utilisateur
                    </Button>
                    <TextInput
                      placeholder="Search by any field"
                      variant="filled"
                      icon={<BsSearch size={14} />}
                      value={search}
                      onChange={handleSearchChange}
                      style={{ width: 320 }}
                    />
                  </div>
                  <Divider style={{ marginBlock: 14 }} />

                  <Table
                    highlightOnHover
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    sx={{ tableLayout: "fixed", minWidth: 700 }}
                  >
                    <colgroup>
                      <col span="1" style={{ width: "4.6%" }} />
                      <col span="1" style={{ width: "14%" }} />
                      <col span="1" style={{ width: "14%" }} />
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "20%" }} />
                      <col span="1" style={{ width: "12%" }} />
                      <col span="1" style={{ width: "10%" }} />
                      <col span="1" style={{ width: "8%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <Th>-</Th>
                        <Th>Noms & role</Th>
                        <Th>Contacts</Th>
                        <Th>Adhésion & statut</Th>
                        <Th>Récente connexion</Th>
                        <Th>Service & Region</Th>
                        <Th>Compte actif</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <tbody>
                        <tr>
                          <td colSpan={8} style={{ height: 120 }}>
                            <FullPageLoader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {rows.length > 0 ? (
                          rows
                        ) : (
                          <tr>
                            <td colSpan={8}>
                              <Text weight={500} align="center">
                                Aucune donnée
                              </Text>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </Table>
                </ScrollArea>
              </div>
            </Card>
          ) : null}
        </Grid.Col>
      </Grid>

      <Modal
        overlayOpacity={0.5}
        opened={createVisible}
        onClose={() => setcreateVisible(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsFolderPlus size={18} style={{ marginRight: 8 }} /> Nouvel
            utilisateur
          </Title>
        }
      >
        <FormUser
          status="create"
          handleClose={() => {
            setcreateVisible(false);
            setselectedUser(undefined);
          }}
        />
      </Modal>

      <Modal
        overlayOpacity={0.5}
        size={640}
        opened={permissionsVisible}
        onClose={() => setpermissionsVisible(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsShieldLock size={18} style={{ marginRight: 8 }} /> Assigner les
            permissions
          </Title>
        }
      >
        <SettingPermission
          user={selectedUser}
          handleClose={() => {
            setpermissionsVisible(false);
            setselectedUser(undefined);
          }}
        />
      </Modal>

      <Modal
        overlayOpacity={0.5}
        opened={editVisible}
        onClose={() => seteditVisible(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "600",
              color: "dodgerblue",
            }}
          >
            <BsPencilSquare size={18} style={{ marginRight: 8 }} /> Modifier
            utilisateur
          </Title>
        }
      >
        <FormUser
          status="edit"
          handleClose={() => {
            seteditVisible(false);
            setselectedUser(undefined);
          }}
          user={selectedUser}
        />
      </Modal>
    </div>
  );
}

export default SettingUsers;
