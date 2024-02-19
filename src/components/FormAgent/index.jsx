import { Button, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { BsCheck2, BsX } from "react-icons/bs";
import { createAgent } from "../../redux/slices/agents";

const createAgentSchema = yup.object().shape({
  name: yup.string().required("champ obligatoire"),
  phone: yup.string().required("champ obligatoire"),
  code: yup.string().optional(),
});

function FormAgent({ status, data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const notifications = useNotifications();

  const form = useForm({
    validate: yupResolver(createAgentSchema),
    initialValues: {
      name: "",
      phone: "",
      code: "",
    },
  });

  function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    if (status === "create") {
      const dataToSubmit = {
        ...values,
      };

      dispatch(createAgent({ dataToSubmit })).then((res) => {
        if (res.payload) {
          handleClose(res.payload);
          notifications.showNotification({
            color: "green",
            title: "Succés",
            message: "Enregistrement reussi!",
            icon: <BsCheck2 size={18} />,
          });
          setloading(false);
        }

        if (res.error) {
          notifications.showNotification({
            color: "red",
            title: "Erreur",
            message: "Echec de l'enregistrement...",
            icon: <BsX size={18} />,
          });
          setloading(false);
        }
      });
    }
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Information de l'aviseur :"
            className="textinput"
            description="Note: Vu que votre aviseur n'est pas membre du service, veuillez inserez son identité et lui assigner un code."
            style={{ width: "100%" }}
            {...form.getInputProps("name")}
            placeholder="Nom complet de la personne aviseure"
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Telephone :"
            style={{ width: "49%" }}
            {...form.getInputProps("phone")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Code :"
            style={{ width: "49%" }}
            {...form.getInputProps("code")}
          />
        </div>

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <Button
            compact
            loading={loading}
            leftIcon={<FaRegSave size={18} />}
            type="submit"
            color="blue"
            size="sm"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormAgent;
