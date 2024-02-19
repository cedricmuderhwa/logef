import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { BsCheck, BsShieldExclamation, BsXLg } from "react-icons/bs";

import { useForm } from "@mantine/form";
import { useListState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { changeUserPermissions } from "../../redux/slices/users";

const initialValues = [
  {
    label: "Lire les informations des differents cas de fraude.",
    checked: false,
    key: "READ_CASE_DATA",
  },
  {
    label: "Lire des informations confidentielles du cas de fraude.",
    checked: false,
    key: "READ_SENSITIVE_DATA",
  },
  {
    label: "Signaler un cas de fraude",
    checked: false,
    key: "SIGNAL_FRAUD_CASE",
  },
  {
    label:
      "Ajouter les informations rélatives à un cas de fraude déjà signalé.",
    checked: false,
    key: "ADD_DATA_TO_CASE",
  },
  {
    label: "Modifier le statut ou situation du cas de fraude déjà signalé.",
    checked: false,
    key: "MODIFY_CASE_STATUS",
  },
  {
    label: "Ajouter ou modifier les informations des utilisateurs.",
    checked: false,
    key: "MODIFY_USERS_INFO",
  },
  {
    label: "Acceder aux rapports des differents dossiers de fraude",
    checked: false,
    key: "READ_FRAUD_REPORTS",
  },
  {
    label:
      "Acceder aux informations des differents aviseurs non-membres de la CNLFM.",
    checked: false,
    key: "READ_ADVISOR_INFO",
  },
  {
    label:
      "Visualiser les statistiques du tableau de bord sur la page d'acceuil",
    checked: false,
    key: "READ_FRAUD_STATISTICS",
  },
  {
    label: "Ajouter une nouvelle région d'operation de la CNLFM",
    checked: false,
    key: "ADD_REGION",
  },
  {
    label: "Changer de region d'opération",
    checked: false,
    key: "CHANGE_LOCATION",
  },
  {
    label: "Ajouter service membre de la CNLFM",
    checked: false,
    key: "ADD_MEMBER_SERVICE",
  },
  {
    label: "Inviter les membres pour la réunion",
    checked: false,
    key: "INVITE_MEMBERS",
  },
  {
    label: "Ajouter presumé fraudeur ou aviseur fraudeur",
    checked: false,
    key: "ADD_ADVISOR",
  },
];

function SettingPermission({ user, handleClose }) {
  const dispatch = useDispatch();

  const [values, handlers] = useListState(() =>
    initialValues.map((o) => {
      return {
        label: o.label,
        key: o.key,
        checked: user?.permissions[o.key],
      };
    })
  );

  const form = useForm({
    initialValues: {
      READ_CASE_DATA: user?.permissions.READ_CASE_DATA || false,
      READ_SENSITIVE_DATA: user?.permissions.READ_SENSITIVE_DATA || false,
      SIGNAL_FRAUD_CASE: user?.permissions.SIGNAL_FRAUD_CASE || false,
      ADD_DATA_TO_CASE: user?.permissions.ADD_DATA_TO_CASE || false,
      MODIFY_CASE_STATUS: user?.permissions.MODIFY_CASE_STATUS || false,
      MODIFY_USERS_INFO: user?.permissions.MODIFY_USERS_INFO || false,
      READ_FRAUD_REPORTS: user?.permissions.READ_FRAUD_REPORTS || false,
      READ_ADVISOR_INFO: user?.permissions.READ_ADVISOR_INFO || false,
      READ_FRAUD_STATISTICS: user?.permissions.READ_FRAUD_STATISTICS || false,
      ADD_REGION: user?.permissions.ADD_REGION || false,
      CHANGE_LOCATION: user?.permissions.CHANGE_LOCATION || false,
      ADD_MEMBER_SERVICE: user?.permissions.ADD_MEMBER_SERVICE || false,
      INVITE_MEMBERS: user?.permissions.INVITE_MEMBERS || false,
      ADD_ADVISOR: user?.permissions.ADD_ADVISOR || false,
    },
  });

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((value, index) =>
    user?.user_role === "Admin provincial" &&
    (value.key === "CHANGE_LOCATION" || value.key === "ADD_REGION") ? null : (
      <Checkbox
        mt="xs"
        ml={33}
        label={value.label}
        checked={value.checked}
        key={value.key}
        {...form.getInputProps(value.key, { type: "checkbox" })}
        onChangeCapture={(event) =>
          handlers.setItemProp(index, "checked", event.currentTarget.checked)
        }
      />
    )
  );

  const [loading, setloading] = useState(false);

  function handleSubmit(values) {
    setloading(true);
    dispatch(
      changeUserPermissions({
        _id: user?._id,
        dataToSubmit: { ...values },
      })
    ).then((res) => {
      if (res.payload) {
        handleClose();
        showNotification({
          color: "green",
          title: "Success",
          message: "Permission saved successfully",
          icon: <BsCheck />,
        });
        setloading(false);
      }

      if (res.error) {
        setloading(false);
        showNotification({
          color: "red",
          title: "Error",
          message: "Une erreur s'est produite...",
          icon: <BsXLg />,
        });
      }
    });
  }

  return (
    <div style={{ border: "1px solid #eaeaea", borderRadius: 4 }}>
      <Grid gutter="sm" style={{ marginBottom: 7 }}>
        <Grid.Col span={12}>
          <Card>
            <div
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div>
                <Text weight="bold" size="lg">
                  {user?.first_name?.concat(" ", user?.last_name)}
                </Text>
                <Text size="sm" italic>
                  {user?.region.region}
                </Text>
                <Text color="blue" size="md" mt={8}>
                  {user?.user_role}
                </Text>
              </div>
              <Avatar size={84} color="blue" />
            </div>
            <Divider />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Title order={4} style={{ marginTop: 14, fontWeight: 600 }}>
                <BsShieldExclamation style={{ marginBottom: -3 }} /> Permissions
                rélatives à l'utilisateur
              </Title>
              <Text size="sm" color="dimmed" style={{ marginTop: 8 }}>
                Cette section vous permet, en tant qu'administrateur, d'assigner
                les differentes permissions ou actions quand pouvant etre
                effectué par l'utilisateur en cours.{" "}
              </Text>

              <div style={{ marginBlock: 14 }}>
                <Checkbox
                  checked={allChecked}
                  indeterminate={indeterminate}
                  label="Autoriser toutes les permissions"
                  transitionDuration={0}
                  onChange={(e) => {
                    form.setValues({
                      READ_CASE_DATA: e.currentTarget.checked,
                      READ_SENSITIVE_DATA: e.currentTarget.checked,
                      SIGNAL_FRAUD_CASE: e.currentTarget.checked,
                      ADD_DATA_TO_CASE: e.currentTarget.checked,
                      MODIFY_CASE_STATUS: e.currentTarget.checked,
                      MODIFY_USERS_INFO: e.currentTarget.checked,
                      READ_FRAUD_REPORTS: e.currentTarget.checked,
                      READ_ADVISOR_INFO: e.currentTarget.checked,
                      READ_FRAUD_STATISTICS: e.currentTarget.checked,
                      ADD_REGION: e.currentTarget.checked,
                      CHANGE_LOCATION: e.currentTarget.checked,
                      ADD_MEMBER_SERVICE: e.currentTarget.checked,
                      INVITE_MEMBERS: e.currentTarget.checked,
                      ADD_ADVISOR: e.currentTarget.checked,
                    });

                    handlers.setState((current) =>
                      current.map((value) => ({
                        ...value,
                        checked: !allChecked,
                      }))
                    );
                  }}
                />
                {items}
              </div>
              <Divider />
              <div
                style={{
                  float: "right",
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: 14,
                }}
              >
                <Button
                  size="sm"
                  compact
                  loading={loading}
                  leftIcon={<FaRegSave />}
                  type="submit"
                  color="blue"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default SettingPermission;
