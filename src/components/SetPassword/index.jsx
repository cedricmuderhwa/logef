import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  PasswordInput,
  Popover,
  Progress,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BsCheck2,
  BsCheckLg,
  BsExclamationOctagonFill,
  BsXLg,
} from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { changePassword } from "../../redux/slices/sessions";

const updateUserSchema = yup.object().shape({
  password: yup.string().min(6).max(44).required("mot de passe exigé"),
  passwordConfirmation: yup.string().min(6).max(44).required("confirmation exigé"),
});

function PasswordRequirement({ meets, label }) {
  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="xs"
    >
      {meets ? <BsCheckLg size={14} /> : <BsXLg size={14} />}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Inclus des chiffres" },
  { re: /[a-z]/, label: "Inclus des miniscules" },
  { re: /[A-Z]/, label: "Inclus des majuscules" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Inclus des symboles specials" },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function SetPassword({ handleClose }) {
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    resolver: yupResolver(updateUserSchema),
  });

  const [loadingPwd, setloadingPwd] = useState(false);

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [valuePwd, setValuePwd] = useState("");
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(valuePwd)}
    />
  ));

  const strength = getStrength(valuePwd);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  function onChangePwd(values) {
    setloadingPwd(true);

    setTimeout(async () => {
      const res = await dispatch(
        changePassword({
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        })
      );

      if (res.payload === undefined) {
        showNotification({
          color: "red",
          title: "Erreur",
          message: "Les mots de passe ne correspondent pas, réessayez!!",
          icon: <BsXLg size={26} />,
        });
      }

      if (res.payload === "Created") {
        showNotification({
          color: "green",
          title: "Réussite",
          message: "Mot de passe changé avec succés",
          icon: <BsCheck2 size={26} />,
        });
        handleClose();
      }
      setloadingPwd(false);
    }, 1000);
  }

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <BsExclamationOctagonFill
            color="orange"
            size={32}
            style={{ marginRight: 14 }}
          />
          <Text weight={600} size="lg">
            Changez votre mot de passe
          </Text>
        </span>
        <Text size="xs" style={{ marginBottom: 4 }}>
          Ne partagez votre mot de passe personnel avec qui que ce soit pour des
          raisons de securité et confidentialité.
        </Text>
      </div>

      <form onSubmit={handleSubmit(onChangePwd)} autoComplete="off">
        <div
          style={{
            width: "100%",
            display: "inline-flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}>
            <Popover
              opened={popoverOpened}
              position="bottom"
              width="target"
              transition="pop"
            >
              <Popover.Target>
                <div
                  onFocusCapture={() => setPopoverOpened(true)}
                  onBlurCapture={() => setPopoverOpened(false)}
                >
                  <PasswordInput
                    value={valuePwd}
                    autoFocus={false}
                    autoComplete="random"
                    key="password"
                    style={{
                      width: "100%",
                    }}
                    size="xs"
                    {...register("password")}
                    onChange={(e) => {
                      setValue("password", e.target.value, {
                        shouldValidate: false,
                      });
                      setValuePwd(e.target.value);
                    }}
                    error={
                      errors.password ? (
                        <span id="error">{errors.password?.message}</span>
                      ) : null
                    }
                    placeholder="Votre nouveau mot de passe"
                    label="Nouveau mot de passe"
                    required
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Progress
                  color={color}
                  value={strength}
                  size={5}
                  style={{ marginBottom: 10 }}
                />
                <PasswordRequirement
                  label="Avoir au moins 6 caractères"
                  meets={valuePwd.length > 5}
                />
                {checks}
              </Popover.Dropdown>
            </Popover>
          </div>

          <div style={{ width: window.innerWidth <= 500 ? "100%" : "49%" }}>
            <PasswordInput
              variant="filled"
              autoComplete="new-password"
              size="xs"
              autoFocus={false}
              style={{
                width: "100%",
              }}
              label="Confirmer votre mot de passe"
              key="passwordConfirmation"
              {...register("passwordConfirmation")}
              onChange={(e) =>
                setValue("passwordConfirmation", e.target.value, {
                  shouldValidate: false,
                })
              }
              error={
                errors.first_name ? (
                  <span id="error">{errors.first_name?.message}</span>
                ) : null
              }
              required
            />
          </div>
        </div>

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 14,
            marginBottom: 14,
          }}
        >
          <Button
            // disabled={!(isAuth === "success")}
            loading={loadingPwd}
            leftIcon={<FaRegSave />}
            type="submit"
            color="blue"
            size="sm"
            compact
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </>
  );
}

export default SetPassword;
