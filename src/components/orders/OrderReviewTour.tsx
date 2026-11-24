import type { RootRedux } from "@/store/store";
import { HelpOutlineRounded } from "@mui/icons-material";
import { TourProvider, useTour, type StepType } from "@reactour/tour";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { orderPrimaryButton, orderSecondaryButton } from "./WaiterOrderLayout";

const breakdownStep: StepType = {
  selector: '[data-review-tour="breakdown"]',
  content:
    "Abre Desglosar platillos para ver una columna por unidad. Puedes cambiar los títulos y guardarlos con Actualizar platillos.",
};

const notesStep: StepType = {
  selector: '[data-review-tour="notes"]',
  content:
    "Aquí puedes escribir indicaciones para toda la orden, como alergias o salsas aparte. Cocina verá estas notas en la comanda.",
};

const steps: Record<"finish" | "addition", StepType[]> = {
  finish: [
    {
      selector: '[data-review-tour="details"]',
      content:
        "Comprueba la mesa y captura el número de comensales. Para llevar, puedes indicar el nombre del cliente.",
    },
    notesStep,
    {
      selector: '[data-review-tour="dishes"]',
      content:
        "Revisa los platillos seleccionados. Las unidades de precio variable aparecen por separado para que puedas capturar su precio.",
    },
    breakdownStep,
    {
      selector: '[data-review-tour="submit"]',
      content:
        "Verifica el total y pulsa Enviar orden para mandar la comanda a cocina.",
    },
  ],
  addition: [
    {
      selector: '[data-review-tour="details"]',
      content:
        "Confirma la mesa y el estado de la orden. Volver a platillos te permite cambiar tu selección.",
    },
    notesStep,
    {
      selector: '[data-review-tour="dishes"]',
      content:
        "Revisa los platillos que vas a añadir. Puedes editar cada unidad de precio variable por separado.",
    },
    breakdownStep,
    {
      selector: '[data-review-tour="submit"]',
      content:
        "Verifica el subtotal y pulsa Enviar adición. Solo se agregarán los platillos de esta revisión.",
    },
  ],
};

function TourTrigger({
  cookieName,
  disabled,
}: {
  cookieName: string;
  disabled: boolean;
}) {
  const { setIsOpen, setCurrentStep } = useTour();
  const started = useRef("");

  useEffect(() => {
    if (!cookieName || disabled || started.current === cookieName) return;
    started.current = cookieName;
    const completed = document.cookie
      .split(";")
      .some((item) => item.trim() === `${cookieName}=1`);
    if (completed) return;

    setCurrentStep(0);
    setIsOpen(true);
  }, [cookieName, disabled, setCurrentStep, setIsOpen]);

  return (
    <button
      type='button'
      aria-label='Abrir tour de ayuda'
      title='Tour de ayuda'
      disabled={disabled}
      className={`${orderSecondaryButton} w-10 !px-0`}
      onClick={() => {
        setCurrentStep(0);
        setIsOpen(true);
      }}
    >
      <HelpOutlineRounded fontSize='small' />
    </button>
  );
}

export default function OrderReviewTour({
  screen,
  disabled = false,
}: {
  screen: keyof typeof steps;
  disabled?: boolean;
}) {
  const uuid = useSelector((state: RootRedux) => state.user?.uuid);
  const cookieName = uuid
    ? `restaurant-review-tour-${screen}-${encodeURIComponent(uuid)}`
    : "";

  return (
    <TourProvider
      steps={steps[screen]}
      disableInteraction
      showDots={false}
      onClickMask={() => {}}
      accessibilityOptions={{
        ariaLabelledBy: "order-review-tour-title",
        closeButtonAriaLabel: "Cerrar tour",
        showNavigationScreenReaders: true,
      }}
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "#204278",
          borderRadius: 16,
          color: "#0f172a",
          maxWidth: "min(22rem, calc(100vw - 2rem))",
        }),
      }}
      prevButton={({ currentStep, setCurrentStep }) =>
        currentStep > 0 ? (
          <button
            type='button'
            className={orderSecondaryButton}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Anterior
          </button>
        ) : null
      }
      nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
        const last = currentStep === stepsLength - 1;
        return (
          <button
            type='button'
            className={orderPrimaryButton}
            onClick={() => {
              if (!last) {
                setCurrentStep(currentStep + 1);
                return;
              }

              if (cookieName) {
                document.cookie = `${cookieName}=1; Max-Age=31536000; Path=/; SameSite=Lax${
                  window.location.protocol === "https:" ? "; Secure" : ""
                }`;
              }
              setIsOpen(false);
            }}
          >
            {last ? "Finalizar tour" : "Siguiente"}
          </button>
        );
      }}
    >
      <TourTrigger cookieName={cookieName} disabled={disabled} />
    </TourProvider>
  );
}
