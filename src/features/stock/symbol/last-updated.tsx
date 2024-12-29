export const LastUpdated = () => {
  const localTime = new Date();
  localTime.setHours(localTime.getHours() + 2);

  return (
    <p className="text-[13px] text-gray-500">
      Last updated: {localTime.toISOString().split('T')[1].slice(0, 8)}
    </p>
  );
};
