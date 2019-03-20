import React from "react";
import { Formik, Form, Field } from "formik";
import styled from "styled-components";
import QrReader from "react-qr-reader";
import { useWeb3 } from "./Web3Context";
import { useToggle } from "./hooks";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

library.add(faQrcode);
library.add(faWindowClose);

const StyledDiv = styled.div`
  border: 3px solid #ececec;
  border-radius: 8px;
  text-align: left;
  margin: 1rem;
  padding: 1rem;
`;

const CreateTokenButton = styled.button`
  background-image: linear-gradient(
    to bottom right,
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
  font-family: "Lucida Console", Monaco, monospace;
  font-weight: bold;
  font-size: 1rem;
  margin: 1rem;
`;

const TokenField = ({
  values,
  errors,
  touched,
  fieldName,
  label,
  placeholder,
  helpText,
  maxLength,
  disabled,
  optionalButton,
  optionalExtraControl
}) => (
  <div
    className={`form-group ${
      errors[fieldName] && touched[fieldName] ? "text-danger" : null
    }`}
  >
    <label htmlFor={fieldName}>{label}</label>
    <div className="input-group">
      <Field
        className={`form-control ${
          errors[fieldName] && touched[fieldName] ? "is-invalid" : null
        }`}
        type="text"
        name={fieldName}
        id={fieldName}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        value={values[fieldName]}
        required
      />
      {optionalButton}
      {errors[fieldName] && touched[fieldName] && (
        <div className="invalid-feedback">{errors[fieldName]}</div>
      )}
    </div>
    {optionalExtraControl}
    <small className="form-text text-muted">{helpText}</small>
  </div>
);

const TokenForm = ({ onSubmit, disabled, initialOwner }) => {
  const [isScanning, toggleScanning, setScanning] = useToggle(false);
  const web3 = useWeb3();

  const onScan = setFieldValue => result => {
    if (web3.utils.isAddress(result)) {
      setFieldValue("initialOwner", result);
      setScanning(false);
    }
  };

  const onError = err => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  const handleSubmitFormik = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  const handleValidation = values => {
    let errors = {};

    if (!values.tokenName || values.tokenName.trim() === "") {
      errors.tokenName = "Token name is required";
    } else if (!/^[a-zA-Z0-9 ]{1,20}$/.test(values.tokenName.trim())) {
      errors.tokenName =
        "Token name must contain between 1 and 20 letters, numbers or spaces";
    }

    if (!values.tokenSymbol || values.tokenSymbol.trim() === "") {
      errors.tokenSymbol = "Token symbol is required";
    } else if (!/^[a-zA-Z]{2,10}$/.test(values.tokenSymbol.trim())) {
      errors.tokenSymbol = "Token symbol must contain between 2 and 10 letters";
    }

    if (!values.initialAmount) {
      errors.initialAmount = "Initial amount is required";
    } else if (!/^[0-9]{1,10}$/.test(values.initialAmount)) {
      errors.initialAmount =
        "Amount must be an integer number between 1 and 1 bi";
    } else {
      const number = parseInt(values.initialAmount);
      if (number < 1 || number > 1000000000) {
        errors.initialAmount =
          "Amount must be an integer number between 1 and 1 bi";
      }
    }

    if (!values.initialOwner) {
      errors.initialOwner = "Initial owner is required";
    } else if (!web3.utils.isAddress(values.initialOwner)) {
      errors.initialOwner = "Enter a valid ETH address";
    }

    return errors;
  };

  return (
    <StyledDiv>
      <Formik
        initialValues={{
          tokenName: "",
          tokenSymbol: "",
          initialAmount: 0,
          initialOwner
        }}
        validate={handleValidation}
        onSubmit={handleSubmitFormik}
        render={({ values, errors, touched, setFieldValue }) => (
          <Form className="needs-validation" noValidate>
            <TokenField
              values={values}
              errors={errors}
              touched={touched}
              fieldName="tokenName"
              label="Token name"
              placeholder="Enter token name"
              helpText="E.g. TestCoin"
              maxLength={20}
              disabled={disabled}
            />
            <TokenField
              values={values}
              errors={errors}
              touched={touched}
              fieldName="tokenSymbol"
              label="Token symbol"
              placeholder="Enter token symbol"
              helpText="E.g. TEST"
              maxLength={10}
              disabled={disabled}
            />
            <TokenField
              values={values}
              errors={errors}
              touched={touched}
              fieldName="initialAmount"
              label="Initial supply"
              placeholder="Enter the initial supply"
              helpText="E.g. 10"
              maxLength={10}
              disabled={disabled}
            />
            <TokenField
              values={values}
              errors={errors}
              touched={touched}
              fieldName="initialOwner"
              label="Initial owner"
              placeholder="Enter the owner address"
              helpText="A valid ethereum address starting with 0x..."
              maxLength={42}
              disabled={disabled}
              optionalButton={
                <button
                  type="button"
                  className="input-group-prepend"
                  onClick={toggleScanning}
                  title={
                    isScanning
                      ? "Click to close camera"
                      : "Click to open the camera and scan a QR code"
                  }
                  disabled={disabled}
                >
                  <FontAwesomeIcon
                    icon={isScanning ? "window-close" : "qrcode"}
                  />
                </button>
              }
              optionalExtraControl={
                isScanning && (
                  <QrReader onScan={onScan(setFieldValue)} onError={onError} />
                )
              }
            />

            <CreateTokenButton key="create" type="submit" disabled={disabled}>
              Create Token!{" "}
              <span role="img" aria-label="to the moon">
                🚀🌙
              </span>
            </CreateTokenButton>
          </Form>
        )}
      />
    </StyledDiv>
  );
};

export default TokenForm;
