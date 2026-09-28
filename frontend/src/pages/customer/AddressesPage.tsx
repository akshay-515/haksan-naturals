import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../api/addressApi";
import type { Address, AddressRequest } from "../../types/address";

const emptyForm: AddressRequest = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<AddressRequest>(emptyForm);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch {
        setError("Failed to load addresses.");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingAddressId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingAddressId !== null) {
        const updatedAddress = await updateAddress(
          editingAddressId,
          form
        );

        setAddresses((currentAddresses) =>
          currentAddresses.map((address) =>
            address.id === updatedAddress.id
              ? updatedAddress
              : address
          )
        );
      } else {
        const newAddress = await createAddress(form);

        setAddresses((currentAddresses) => [
          ...currentAddresses,
          newAddress,
        ]);
      }

      resetForm();
    } catch {
      setError("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddressId(address.id);

    setForm({
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });

    setError("");
  };

  const handleDelete = async (addressId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAddress(addressId);

      setAddresses((currentAddresses) =>
        currentAddresses.filter(
          (address) => address.id !== addressId
        )
      );

      if (editingAddressId === addressId) {
        resetForm();
      }
    } catch {
      setError("Failed to delete address.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-gray-600">Loading addresses...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Addresses
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Saved Addresses
          </h2>

          {addresses.length === 0 ? (
            <div className="rounded-lg border border-gray-200 p-6 text-gray-600">
              No saved addresses yet.
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <h3 className="font-semibold text-gray-900">
                    {address.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {address.phone}
                  </p>

                  <p className="mt-3 text-sm text-gray-700">
                    {address.addressLine}
                    <br />
                    {address.city}, {address.state}
                    <br />
                    {address.pincode}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(address)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(address.id)}
                      className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {editingAddressId !== null
              ? "Edit Address"
              : "Add Address"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-gray-200 p-6"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <input
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              placeholder="Address"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingAddressId !== null
                    ? "Update Address"
                    : "Add Address"}
              </button>

              {editingAddressId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export { AddressesPage };