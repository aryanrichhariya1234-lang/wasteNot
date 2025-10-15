import { createOrder } from "../_lib/actions";

function NewOrderModal({
  onClose,
  handleClick,
  setIsOpenModal,
  cityName,
  position,
  provider,
  setCityName,
}) {
  return (
    <>
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Add new Listing</h2>
      </div>

      <form
        action={(formData) => createOrder({ position, formData, provider })}
        className="space-y-4"
      >
        <input type="hidden" name="id" />

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="foodProviderName"
              className="block text-sm font-medium text-gray-700"
            >
              Provider Name / Organization
            </label>
            <input
              type="text"
              id="foodProvider"
              name="foodProvider"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Estimated Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="items"
            className="block text-sm font-medium text-gray-700"
          >
            Food Items Description
          </label>
          <textarea
            id="items"
            name="items"
            rows="3"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>

          <div className="mt-1 flex space-x-3">
            <input
              type="text"
              id="position"
              name="position"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="block flex-grow border border-gray-300 rounded-md shadow-sm p-3"
            />

            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-3 bg-blue-500 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-600 transition duration-150 whitespace-nowrap"
            >
              Get Position
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}

export default NewOrderModal;
