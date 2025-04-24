export const Greeting: React.FC = () => {
  const date = new Date();
  const hour = date.getHours();

  let greeting = "";
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <p className="text-2xl font-semibold text-primary mb-4">
      <span className="text-gray-500">Hey there,</span> {greeting}
    </p>
  );
};
