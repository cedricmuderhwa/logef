import { Button, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { BsCheck2, BsX, BsXLg } from "react-icons/bs";
import {
  createContainer,
  updateContainer,
} from "../../redux/slices/containers";

const createContainerSchema = yup.object().shape({
  name: yup.string().required("champ obligatoire"),
});

function FormContainer({ status, data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createContainerSchema),
    initialValues: {
      name: "",
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
        dispatch(createContainer({ dataToSubmit })).then((res) => {
          if (res.payload) {
            handleClose();
            showNotification({
              color: "green",
              title: "Réussite",
              message: "Enregistrement réussi!",
              icon: <BsCheck2 size={24} />,
            });
            setloading(false);
          }

          if (res.error) {
            showNotification({
              color: "red",
              title: "Erreur",
              message: "Echec de l'enregistrement!!",
              icon: <BsXLg size={26} />,
            });
            setloading(false);
          }
        });
      }, 1000);
    }

    if (status === "edit") {
      dispatch(
        updateContainer({ _id: data?._id, dataToSubmit: { ...values } })
      ).then((res) => {
        if (res.payload) {
          handleClose();
          showNotification({
            color: "green",
            title: "Réussite",
            message: "Enregistrement réussi!",
            icon: <BsCheck2 size={24} />,
          });
          setloading(false);
        }

        if (res.error) {
          showNotification({
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
            label="Conditionnement de la substance :"
            className="textinput"
            description="Les substances ont été saisi étant contenu dans un emballage, qui soit le descriptif du conditionnement de la substance. "
            style={{ width: "100%" }}
            {...form.getInputProps("name")}
          />
        </div>

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

export default FormContainer;
