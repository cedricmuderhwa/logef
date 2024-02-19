/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Grid,
  Modal,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsAlarmFill, BsX } from "react-icons/bs";
import { FiLogIn } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { MdLockOutline, MdOutlineMailOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import SetPassword from "../../components/SetPassword";
import { authUser, login } from "../../redux/slices/sessions";
import "./auth.scss";

const createSessionSchema = yup.object().shape({
  email: yup.string().required("email is required").email("not a valid email"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password should be 6 chars minimum")
    .max(44),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [changePwd, setchangePwd] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(createSessionSchema),
  });

  useEffect(() => {
    const expired = searchParams?.get("expired");
    const data = localStorage?.getItem("rememberMe");

    if (data) {
      setValue("email", data);
      setValue("remember", true);
    }

    if (expired) {
      showNotification({
        color: "blue",
        icon: <BsAlarmFill />,
        title: "Oops!",
        message: "Votre session a expiré...",
      });
    }
  }, []);

  function onSubmit(values) {
    setLoading(true);

    dispatch(login(values)).then(async (res) => {
      if (res?.payload) {
        setLoading(false);
        sessionStorage.setItem("accessToken", res?.payload?.accessToken);
        sessionStorage.setItem("refreshToken", res?.payload?.refreshToken);

        const auth = await dispatch(authUser());
        if (auth?.payload) {
          if (auth?.payload.isNewUser) {
            return setchangePwd(true);
          }
          navigate(`/auth/dashboard`, { replace: true });
        }
      }

      if (res?.error) {
        setLoading(false);
        setSignInError("Wrong id or password");
        showNotification({
          color: "red",
          title: "Identifiants incorrects!",
          message: "Veuillez verifier vos informations...",
          icon: <BsX size={24} />,
        });
        setTimeout(() => {
          setSignInError("");
        }, 5000);
      }
    });
  }

  return (
    <div className="signin-in" style={{ margin: 0, padding: 0 }}>
      <Grid
        className="loginthing"
        style={{ margin: 0, padding: 0 }}
        justify="center"
      >
        {window.innerWidth <= 1280 ? (
          <div
            style={{
              width: "100%",
              display: "inline-flex",
              justifyContent: "center",
              marginTop: 80,
              marginBottom: -40,
            }}
          >
            <img src="./white-2.svg" width="180px" height="auto" alt="" />
          </div>
        ) : null}
        <Grid.Col
          xs={1}
          sm={1}
          md={1}
          lg={2}
          xl={4}
          className="login-in-sec"
          style={{ margin: 0, padding: 0 }}
        >
          <div className="login-sec">
            <h3 id="signin-sec">Se connecter</h3>
            <p className="error">
              {signInError ? (
                <span id="error" style={{ color: "red", fontSize: 12 }}>
                  <IoWarningOutline />
                  {signInError}
                </span>
              ) : (
                ""
              )}
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="formField">
                <TextInput
                  size="xs"
                  key="email"
                  label="Identifiant :"
                  {...register("email")}
                  icon={<MdOutlineMailOutline />}
                  type="email"
                  placeholder="Votre identifiant"
                  onChange={(e) =>
                    setValue("email", e.target.value, { shouldValidate: true })
                  }
                  error={
                    errors.email ? (
                      <span id="error">
                        <IoWarningOutline />
                        {errors.email?.message}
                      </span>
                    ) : null
                  }
                />
              </div>
              <div className="formField">
                <PasswordInput
                  size="xs"
                  key="password"
                  label="Mot de passe :"
                  {...register("password")}
                  icon={<MdLockOutline />}
                  placeholder="Votre mot de passe"
                  onChange={(e) =>
                    setValue("password", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  error={
                    errors.password ? (
                      <span id="error">
                        <IoWarningOutline />
                        {errors.password?.message}
                      </span>
                    ) : null
                  }
                />
              </div>

              <div className="fgtpwd">
                <Checkbox label="Se souvenir de moi" size="xs" color="blue" />
                <NavLink style={{ fontSize: 12 }} to="/forgot-password">
                  Mot de passe oublié?
                </NavLink>
              </div>
              <Button
                loading={loading}
                leftIcon={<FiLogIn />}
                type="submit"
                color="blue"
                size="xs"
              >
                Se connecter
              </Button>
            </form>
          </div>
        </Grid.Col>
        {window.innerWidth <= 1280 ? null : (
          <Grid.Col
            xs={1}
            sm={1}
            md={1}
            lg={2}
            xl={8}
            style={{ margin: 0, padding: 0 }}
          >
            <div className="cmp-info">
              <div className="area">
                <ul className="circles">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <img src="./white-2.svg" width="500px" height="auto" alt="" />
                <p>
                  {" "}
                  Copyright &#169; {new Date().getFullYear()} CNLFM. Tout droits
                  reservés.
                </p>
              </div>
            </div>
          </Grid.Col>
        )}
      </Grid>
      <Modal
        opened={changePwd}
        onClose={() => setchangePwd(false)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <SetPassword
          status="create"
          handleClose={() => {
            setchangePwd(false);
            navigate(`/auth/dashboard`, { replace: true });
          }}
        />
      </Modal>
    </div>
  );
}

export default LoginPage;
