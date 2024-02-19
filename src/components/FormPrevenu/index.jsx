import {
  ActionIcon,
  Button,
  Divider,
  FileInput,
  Modal,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave, FaUserCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import Axios from "axios";
import { BsCheck2, BsPlusLg, BsXLg } from "react-icons/bs";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";
import FormFraudeur from "../FormFraudeur";

const createPrevenuSchema = yup.object().shape({
  fraudeur: yup.string().required("champ obligatoire"),
  address: yup.string().required("champ obligatoire"),
  profession: yup.string().required("champ obligatoire"),
  no_identite: yup.string().required("champ obligatoire"),
  role: yup.string().required("champ obligatoire"),
  file_url: yup.string().required("champ obligatoire"),
});

function FormPrevenu({ data, handleClose }) {
  const dispatch = useDispatch();
  const fraudeurs = useSelector((state) => state.fraudeurs);
  const [loading, setloading] = useState(false);
  const [fraudeur, setfraudeur] = useState(false);

  const form = useForm({
    validate: yupResolver(createPrevenuSchema),
    initialValues: {
      fraudeur: "",
      address: "",
      profession: "",
      no_identite: "",
      role: "",
      file_url: "",
    },
  });

  const fraudeurList = !fraudeurs
    ? []
    : fraudeurs?.map((obj) => {
        return {
          label: obj.nom.concat(" ", obj.postnom, " ", obj.prenom),
          value: obj._id,
        };
      });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const formData = new FormData();

    formData.append("file", values.file_url);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    await showNotification({
      id: "load-data",
      loading: true,
      color: "blue",
      title: "Chargement du fichier en cours...",
      autoClose: false,
      disallowClose: true,
    });

    Axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData).then(
      async (response) => {
        if (response.data) {
          const dataToSubmit = {
            action: "add-prevenus",
            fraudeur: values.fraudeur,
            address: values.address,
            profession: values.profession,
            no_identite: values.no_identite,
            role: values.role,
            doc_url: response.data.secure_url,
          };

          await updateNotification({
            id: "load-data",
            color: "green",
            loading: true,
            title: "Enregistrement en cours...",
            disallowClose: true,
            autoClose: false,
          });

          const res = await dispatch(
            updateFraud({ _id: data?._id, dataToSubmit })
          );

          if (res.payload) {
            handleClose();

            await dispatch(findSelected(data?._id));

            return await updateNotification({
              id: "load-data",
              color: "green",
              title: "Reussite",
              message: "Enregistrement reussi",
              icon: <BsCheck2 size={24} />,
              autoClose: 3000,
            });
          }

          setloading(false);

          return showNotification({
            color: "red",
            title: "Erreur",
            message: "Echec de l'enregistrement...",
            icon: <BsXLg size={26} />,
          });
        }
      }
    );
  }

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <Select
            data={fraudeurList}
            searchable
            size="sm"
            className="textinput"
            description="Presumé fraudeur : "
            style={{ width: "90%" }}
            {...form.getInputProps("fraudeur")}
          />
          <ActionIcon
            variant="filled"
            color="teal"
            size="lg"
            style={{ marginBottom: 1 }}
            onClick={() => setfraudeur(true)}
          >
            <BsPlusLg />
          </ActionIcon>
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Adresse physique : "
            style={{ width: "59%" }}
            {...form.getInputProps("address")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Profession : "
            style={{ width: "39%" }}
            {...form.getInputProps("profession")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Nº P.I. /C.E et/ou P : "
            style={{ width: "49%" }}
            {...form.getInputProps("no_identite")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Role dans le cas : "
            style={{ width: "49%" }}
            {...form.getInputProps("role")}
          />
        </div>

        <div className="dates">
          <FileInput
            variant="filled"
            size="sm"
            style={{ width: "100%" }}
            description="Sélectionner d'identification du prevenu que vous voulez importer :"
            label="Joindre le fichier d'identité du prevenu "
            {...form.getInputProps("file_url")}
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

      <Modal
        opened={fraudeur}
        onClose={() => setfraudeur(false)}
        title={
          <Title
            order={5}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <FaUserCog size={20} style={{ marginRight: 8 }} /> Nouveau presumé
            fraudeur
          </Title>
        }
      >
        <FormFraudeur status="create" handleClose={() => setfraudeur(false)} />
      </Modal>
    </div>
  );
}

export default FormPrevenu;
