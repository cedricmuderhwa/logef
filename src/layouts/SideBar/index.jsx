import {
  Center,
  Group,
  Modal,
  Navbar,
  Title,
  Tooltip,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import React, { useState } from "react";
import {
  BsArrowBarLeft,
  BsArrowLeftRight,
  BsColumnsGap,
  BsFileEarmarkCheckFill,
  BsFillExclamationOctagonFill,
  BsGearFill,
  BsPeopleFill,
  BsPersonBadgeFill,
  BsPinMapFill,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import FormRegionChange from "../../components/FormRegionChange";
import { logout } from "../../redux/slices/sessions";
import "./sidebar.scss";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      backgroundColor: theme.colors[theme.primaryColor][5],
    },
  },

  active: {
    opacity: 1,
    "&, &:hover": {
      backgroundColor: theme.colors[theme.primaryColor][7],
    },
  },
}));

function NavbarLink({ icon: Icon, label, active, onClick }) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip
      label={label}
      position="right"
      withArrow
      transition="pop-bottom-left"
      transitionDuration={5}
    >
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size={16} />
      </UnstyledButton>
    </Tooltip>
  );
}

const data = [
  { link: "/auth/dashboard", label: "Acceuil", icon: BsColumnsGap },
  {
    link: "/auth/fraud-cases",
    label: "Cas de fraude",
    icon: BsFillExclamationOctagonFill,
  },
  { link: "/auth/negociants", label: "Négociants", icon: BsPersonBadgeFill },
  { link: "/auth/reports", label: "Rapports", icon: BsFileEarmarkCheckFill },
  { link: "/auth/users", label: "Utilisateurs", icon: BsPeopleFill },
  { link: "/auth/settings", label: "Paramètres", icon: BsGearFill },
];

const useNavbarStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

function SideBar() {
  const [active, setActive] = useState(0);
  const { classes } = useNavbarStyles();
  const loggedInUser = useSelector((state) => state.sessions.authUser);
  const [region, setRegion] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/login");
  };

  const links = data.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        navigate(link.link);
      }}
    />
  ));

  return (
    <Navbar
      height="100%"
      width={{ base: 80 }}
      p="md"
      className={classes.navbar}
    >
      <Center style={{ marginTop: 18 }}>
        <img src="./white-2.svg" width={65} height="auto" alt="logo" />
      </Center>
      <Navbar.Section grow mt={50}>
        <Group direction="column" align="center" spacing={0}>
          {links}
        </Group>
      </Navbar.Section>
      <Navbar.Section style={{ marginBottom: 14 }}>
        <Group direction="column" align="center" spacing={0}>
          {loggedInUser?.permissions?.CHANGE_LOCATION ? (
            <NavbarLink
              icon={BsArrowLeftRight}
              label="Changer de region"
              onClick={() => setRegion(true)}
            />
          ) : null}
          <NavbarLink
            icon={BsArrowBarLeft}
            label="Se déconnecter"
            onClick={(event) => handleLogout(event)}
          />
        </Group>
      </Navbar.Section>
      <Outlet />

      <Modal
        opened={region}
        onClose={() => setRegion(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "dodgerblue",
            }}
          >
            <BsPinMapFill size={20} style={{ marginRight: 8 }} /> Changer de
            region
          </Title>
        }
      >
        <FormRegionChange
          status="edit"
          handleClose={() => setRegion(false)}
          data={loggedInUser}
        />
      </Modal>
    </Navbar>
  );
}

export default SideBar;
