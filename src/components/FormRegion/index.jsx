import { Button, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { BsCheck2, BsX } from "react-icons/bs";
import { FaRegSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { createRegion, updateRegion } from "../../redux/slices/regions";

const createRegionSchema = yup.object().shape({
  region: yup.string().required("champ obligatoire"),
});

function FormRegion({ status, data, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createRegionSchema),
    initialValues: {
      region: "",
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
        dispatch(createRegion({ dataToSubmit })).then((res) => {
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

    if (status === "edit") {
      dispatch(
        updateRegion({ _id: data?._id, dataToSubmit: { ...values } })
      ).then((res) => {
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
    }
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            label="Region :"
            className="textinput"
            description="Nom de la région :"
            style={{ width: "100%" }}
            {...form.getInputProps("region")}
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

export default FormRegion;
