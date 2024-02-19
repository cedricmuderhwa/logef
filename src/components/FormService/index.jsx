import { Button, Divider, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { BsCheck2, BsX } from "react-icons/bs";
import { createService } from "../../redux/slices/services";

const createServiceSchema = yup.object().shape({
  code: yup.string().required("champ obligatoire"),
  service_name: yup.string().required("champ obligatoire"),
});

function FormService({ status, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createServiceSchema),
    initialValues: {
      code: "",
      service_name: "",
    },
  });

  function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    if (status === "create") {
      const dataToSubmit = {
        ...values,
      };

      setTimeout(() => {
        dispatch(createService({ dataToSubmit })).then((res) => {
          if (res.payload) {
            handleClose();
            showNotification({
              color: "green",
              title: "Réussite",
              message: "Enregistrement réussi!",
              icon: <BsCheck2 size={18} />,
            });
            setloading(false);
          }

          if (res.error) {
            console.log("Err => ", res.error);
            showNotification({
              color: "red",
              title: "Erreur",
              message: "Enregistrement echoué...",
              icon: <BsX size={18} />,
            });
            setloading(false);
          }
        });
      }, 1000);
    }
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Information du service membre :"
            className="textinput"
            description="Nom ou sigle : "
            style={{ width: "59%" }}
            {...form.getInputProps("service_name")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Code :"
            style={{ width: "39%" }}
            {...form.getInputProps("code")}
          />
        </div>

        <Divider style={{ marginTop: 14 }} />

        <div
          style={{
            float: "right",
            display: "inline-flex",
            alignItems: "center",
            marginTop: 28,
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

export default FormService;
