export default function AuthStepProgress({ steps = [], currentStep = 1 }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex w-full items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;

          return (
            <div
              key={step.label}
              className="relative flex flex-1 flex-col items-center"
            >
              <div
                className={`z-10 flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? "bg-primary text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-1 w-full ${
                    currentStep > stepNumber ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {steps.map((step, index) => (
          <p
            key={step.label}
            className={`flex-1 text-center text-xs ${
              currentStep === index + 1
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {step.label}
          </p>
        ))}
      </div>
    </div>
  );
}