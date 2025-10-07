import toast from "react-hot-toast";

const showClosableToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center justify-between max-w-md w-full bg-white border border-gray-200 shadow-lg rounded-lg p-4 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <span className="text-gray-800 text-sm">{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-3 text-gray-400 hover:text-gray-700"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  ));
};
