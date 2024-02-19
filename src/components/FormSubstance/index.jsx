import {
  ActionIcon,
  Button,
  Divider,
  Modal,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import { FaRegSave, FaUserCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { BsBag, BsCheck2, BsPlusLg, BsXLg } from "react-icons/bs";
import { LoadContainers } from "../../hooks/fetchContainer";
import { LoadServices } from "../../hooks/fetchService";
import { findSelected } from "../../redux/slices/current";
import { updateFraud } from "../../redux/slices/fraud_cases";
import FormContainer from "../FormContainer";
import FormService from "../FormService";

const optionsCategory = [
  { label: "Pierres", value: "Pierres" },
  { label: "Métaux", value: "Métaux" },
];

const optionsFiliere = [
  ["Pierres de couleurs", "Diamant"],
  [
    "Or",
    "Stannifère",
    "Lithium",
    "Ferreux ou non-ferreux",
    "Terres rares",
    "Radioactifs",
  ],
];

const optionsUnite = [
  { label: "t", value: "t" },
  { label: "kg", value: "kg" },
  { label: "gr", value: "gr" },
  { label: "ct", value: "ct" },
];

const createSubstanceSchema = yup.object().shape({
  category: yup.string().required("champ obligatoire"),
  filiere: yup.string().required("champ obligatoire"),
  nature: yup.string().required("champ obligatoire"),
  teneur: yup.number().required("champ obligatoire"),
  colis: yup.string().required("champ obligatoire"),
  weight: yup.number().required("champ obligatoire"),
  unit: yup.string().required("champ obligatoire"),
  valeur_de_base: yup.number().required("champ obligatoire"),
  valeur_marchande: yup.number().required("champ obligatoire"),
  conditionnement: yup.string().required("champ obligatoire"),
  gardiennage: yup.string().required("champ obligatoire"),
  consignation: yup.string().required("champ obligatoire"),
});

function FormSubstance({ status, data, handleClose }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);
  const containers = useSelector((state) => state.containers);

  const [loading, setloading] = useState(false);
  const [currentFill, setcurrentFill] = useState("Pierres");

  LoadServices();
  LoadContainers();

  const [service, setservice] = useState(false);
  const [conditionnement, setconditionnement] = useState(false);

  const form = useForm({
    validate: yupResolver(createSubstanceSchema),
    initialValues: {
      category: "",
      filiere: "",
      nature: "",
      teneur: 0,
      colis: "",
      weight: 0,
      unit: "",
      valeur_de_base: 0,
      valeur_marchande: 0,
      conditionnement: "",
      gardiennage: "",
      consignation: "",
    },
  });

  const handleChange = (e) => {
    setcurrentFill(e.target.value);
  };

  const serviceList = !services
    ? []
    : services?.map((obj) => {
        return {
          label: obj.service_name,
          value: obj._id,
        };
      });

  const containerList = !containers
    ? []
    : containers?.map((obj) => {
        return {
          label: obj.name,
          value: obj._id,
        };
      });

  async function handleSubmit(values, e) {
    e.preventDefault();
    setloading(true);

    const res = await dispatch(
      updateFraud({
        _id: data?._id,
        dataToSubmit: {
          ...values,
          fraud_id: data?._id,
          action: "add-substances",
        },
      })
    );

    if (res.payload) {
      handleClose();
      await dispatch(findSelected(data?._id));
      return showNotification({
        color: "green",
        title: "Reussite",
        message: "Enresgistrement reussi",
        icon: <BsCheck2 size={24} />,
      });
    }
    setloading(false);

    return showNotification({
      color: "red",
      title: "Erreur",
      message: "Echec de l'enregistrement!!",
      icon: <BsXLg size={26} />,
    });
  }

  const handleCalculate = () => {
    const weight = form.values.weight;
    const base_value = form.values.valeur_de_base;

    form.setFieldValue("valeur_marchande", parseFloat(weight * base_value));
  };

  return (
    <div style={{ borderTop: "1px solid #eaeaea", marginTop: -8 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="dates">
          <Select
            data={optionsCategory}
            defaultChecked="Métaux"
            variant="filled"
            size="sm"
            label="Etat de la substance:"
            className="textinput"
            description="Categorisation de la substance: "
            style={{ width: "49%" }}
            onSelect={handleChange}
            {...form.getInputProps("category")}
          />
          <Select
            data={
              currentFill === "Pierres" ? optionsFiliere[0] : optionsFiliere[1]
            }
            variant="filled"
            size="sm"
            label="Filiere:"
            className="textinput"
            description="Filière de la substance: "
            style={{ width: "49%" }}
            {...form.getInputProps("filiere")}
          />
        </div>
        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Nature de la substance :"
            style={{ width: "49%" }}
            {...form.getInputProps("nature")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Teneur: "
            style={{ width: "49%" }}
            {...form.getInputProps("teneur")}
          />
        </div>

        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Nbre colis :"
            style={{ width: "32.5%" }}
            onSelect={handleCalculate}
            {...form.getInputProps("colis")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Poids :"
            style={{ width: "32.5%" }}
            onSelect={handleCalculate}
            {...form.getInputProps("weight")}
          />
          <Select
            data={optionsUnite}
            variant="filled"
            size="sm"
            className="textinput"
            description="Unité :"
            style={{ width: "32.5%" }}
            {...form.getInputProps("unit")}
          />
        </div>

        <div className="dates">
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Valeur de base/grille tarifère (USD) :"
            style={{ width: "49%" }}
            onSelect={handleCalculate}
            {...form.getInputProps("valeur_de_base")}
          />
          <TextInput
            variant="filled"
            size="sm"
            className="textinput"
            description="Valeur marchande (USD) :"
            style={{ width: "49%" }}
            {...form.getInputProps("valeur_marchande")}
          />
        </div>

        <div className="dates">
          <Select
            data={containerList}
            variant="filled"
            size="sm"
            label="Conditionnement :"
            className="textinput"
            description="Selectionner le conditionnement de la substance: "
            style={{ width: "90%" }}
            {...form.getInputProps("conditionnement")}
          />
          <ActionIcon
            variant="filled"
            size="lg"
            color="blue"
            style={{ marginBottom: 1 }}
            onClick={() => setconditionnement(true)}
          >
            <BsPlusLg />
          </ActionIcon>
        </div>

        <div className="dates">
          <Select
            data={serviceList}
            variant="filled"
            size="sm"
            className="textinput"
            description="Gardiennage: "
            style={{ width: "49%" }}
            {...form.getInputProps("gardiennage")}
          />
          <TextInput
            data={optionsUnite}
            variant="filled"
            size="sm"
            className="textinput"
            description="Consignation :"
            style={{ width: "49%" }}
            {...form.getInputProps("consignation")}
          />
        </div>

        <Divider style={{ marginTop: 14 }} />

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

      <Modal
        opened={service}
        onClose={() => setservice(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <FaUserCog size={20} style={{ marginRight: 8 }} /> Nouveau service
          </Title>
        }
      >
        <FormService />
      </Modal>

      <Modal
        opened={conditionnement}
        onClose={() => setconditionnement(false)}
        title={
          <Title
            order={4}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "400",
              color: "green",
            }}
          >
            <BsBag size={20} style={{ marginRight: 8 }} /> Nouveau
            conditionnement
          </Title>
        }
      >
        <FormContainer
          status="create"
          handleClose={() => setconditionnement(false)}
        />
      </Modal>
    </div>
  );
}

export default FormSubstance;
