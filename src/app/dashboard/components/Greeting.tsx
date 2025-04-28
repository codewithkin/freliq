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
    <p className="text-xl font-medium flex justify-center items-center">
      <span className="text-gray-500 hidden md:inline-block">Hey there,</span>{" "}
      {greeting}
    </p>
  );
};
