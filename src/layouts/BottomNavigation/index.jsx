import {
  createStyles,
  Group,
  Navbar,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import React, { useState } from "react";
import {
  BsArrowBarLeft,
  BsColumnsGap,
  BsFillExclamationOctagonFill,
  BsGearFill,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/sessions";
import "./bottomnav.scss";

const useStyles = createStyles((theme) => ({
  link: {
    width: 32,
    height: 32,
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
      position="top"
      withArrow
      transition="pop-bottom-top"
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
  { link: "/auth/settings", label: "Paramètres", icon: BsGearFill },
];

const useNavbarStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

function BottomNavigation() {
  const [active, setActive] = useState(0);
  const { classes } = useNavbarStyles();
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
      height={{ base: 68 }}
      width="100%"
      p="sm"
      className={classes.navbar}
    >
      <Navbar.Section grow>
        <Group position="center" spacing="md">
          {links}
          <NavbarLink
            icon={BsArrowBarLeft}
            label="Se déconnecter"
            onClick={(event) => handleLogout(event)}
          />
        </Group>
      </Navbar.Section>
      <Outlet />
    </Navbar>
  );
}

export default BottomNavigation;
