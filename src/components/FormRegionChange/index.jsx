import { Button, Select } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { BsInfoLg, BsXLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { LoadRegions } from "../../hooks/fetchRegion";
import { changeRegion, logout } from "../../redux/slices/sessions";

const changeRegionSchema = yup.object().shape({
  region: yup.string().required("Champ obligatoire"),
});

function FormRegionChange({ status, handleClose }) {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  LoadRegions();
  const regions = useSelector((state) => state.regions);
  const authUserRegion = useSelector((state) => state.sessions.authUser).region
    ._id;
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(changeRegionSchema),
    initialValues: {
      region: authUserRegion,
    },
  });

  const userList = !regions
    ? []
    : regions.map((region) => {
        return {
          label: region.region,
          value: region._id,
        };
      });

  function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    if (status === "edit") {
      dispatch(changeRegion({ ...values })).then((res) => {
        if (res.payload) {
          handleClose();
          showNotification({
            id: "load-data",
            loading: true,
            color: "gray",
            title: "Redirection en cours...",
            message: "Vous serez redirigé vers la page de connexion...",
            autoClose: false,
            disallowClose: true,
          });

          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "blue",
              title: "Changement reussi!",
              message: "Veuillez vous réconnecter...",
              icon: <BsInfoLg size={16} />,
              autoClose: 3000,
            });

            dispatch(logout());
            navigate("/login");
          }, 3000);
          setloading(false);
        }

        if (res.error) {
          console.log("Err => ", res.error);
          showNotification({
            color: "red",
            title: "Echec",
            message: "Enregistrement echoué...",
            icon: <BsXLg size={18} />,
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
          <Select
            data={userList}
            searchable
            variant="filled"
            size="sm"
            className="textinput"
            label="Changer de region"
            description="Cette option est seulement applicable aux administrateurs nationaux : "
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

export default FormRegionChange;
