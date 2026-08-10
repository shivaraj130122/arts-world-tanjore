import { useEffect, useState } from "react";
import {
  FiEye,
  FiMail,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Container from "../components/ui/Container";

import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../services/contactService";

const AdminMessages = () => {
  const [messages, setMessages] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectedMessage, setSelectedMessage] =
    useState(null)

  useEffect(() => {
    let cancelled = false;

    const loadInitialMessages =
      async () => {
        try {
          const data =
            await getContactMessages();

          if (!cancelled) {
            setMessages(
              data.messages || []
            );
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Load messages error:",
              error
            );

            toast.error(
              error.message ||
                "Unable to load messages"
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    loadInitialMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenMessage =
    async (message) => {
      setSelectedMessage(
        message
      );

      if (message.status === "new") {
        try {
          const data =
            await updateContactMessageStatus(
              message._id,
              "read"
            );

          setMessages(
            (current) =>
              current.map(
                (item) =>
                  item._id ===
                  message._id
                    ? data.contactMessage
                    : item
              )
          );

          setSelectedMessage(
            data.contactMessage
          );
        } catch (error) {
          console.error(
            "Update message status error:",
            error
          );
        }
      }
    };

  const handleStatusChange =
    async (
      id,
      status
    ) => {
      try {
        const data =
          await updateContactMessageStatus(
            id,
            status
          );

        setMessages(
          (current) =>
            current.map(
              (item) =>
                item._id === id
                  ? data.contactMessage
                  : item
            )
        );

        if (
          selectedMessage?._id ===
          id
        ) {
          setSelectedMessage(
            data.contactMessage
          );
        }

        toast.success(
          "Message status updated!"
        );
      } catch (error) {
        console.error(
          "Status update error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to update status"
        );
      }
    };

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this message?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteContactMessage(
          id
        );

        setMessages(
          (current) =>
            current.filter(
              (item) =>
                item._id !== id
            )
        );

        if (
          selectedMessage?._id ===
          id
        ) {
          setSelectedMessage(
            null
          );
        }

        toast.success(
          "Message deleted successfully!"
        );
      } catch (error) {
        console.error(
          "Delete message error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to delete message"
        );
      }
    };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleString();
  };

  const getStatusClass = (
    status
  ) => {
    if (status === "new") {
      return "bg-red-100 text-red-700";
    }

    if (status === "read") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="py-10 sm:py-14">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">
            Administration
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                Contact Messages
              </h1>

              <p className="mt-2 text-sm text-text/60">
                Manage messages sent by
                customers.
              </p>
            </div>

            <div className="rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              {messages.length}{" "}
              messages
            </div>
          </div>
        </div>

        {/* Messages */}
        <section className="rounded-3xl border border-primary/10 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-text/55">
              Loading messages...
            </div>
          ) : messages.length ===
            0 ? (
            <div className="p-10 text-center">
              <FiMail
                size={34}
                className="mx-auto text-primary/30"
              />

              <p className="mt-3 text-sm text-text/55">
                No contact messages
                yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {messages.map(
                (message) => (
                  <div
                    key={
                      message._id
                    }
                    className={`p-5 transition hover:bg-primary/[0.02] sm:p-6 ${
                      message.status ===
                      "new"
                        ? "bg-primary/[0.025]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className={`text-base ${
                              message.status ===
                              "new"
                                ? "font-bold text-primary"
                                : "font-semibold text-text"
                            }`}
                          >
                            {
                              message.name
                            }
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusClass(
                              message.status
                            )}`}
                          >
                            {
                              message.status
                            }
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-text/55">
                          {
                            message.email
                          }
                        </p>

                        {message.subject && (
                          <p className="mt-3 text-sm font-semibold text-primary">
                            {
                              message.subject
                            }
                          </p>
                        )}

                        <p className="mt-2 line-clamp-2 text-sm text-text/60">
                          {
                            message.message
                          }
                        </p>

                        <p className="mt-3 text-xs text-text/40">
                          {
                            formatDate(
                              message.createdAt
                            )
                          }
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenMessage(
                              message
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                        >
                          <FiEye
                            size={15}
                          />
                          View
                        </button>

                        {message.status !==
                          "replied" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                message._id,
                                "replied"
                              )
                            }
                            className="rounded-full border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                          >
                            Mark Replied
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              message._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <FiTrash2
                            size={15}
                          />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Message Details Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-primary/10 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary-dark">
                    Customer Message
                  </p>

                  <h2 className="mt-1 font-heading text-2xl font-bold text-primary">
                    {
                      selectedMessage.name
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMessage(
                      null
                    )
                  }
                  className="grid h-10 w-10 place-items-center rounded-full text-text/60 transition hover:bg-primary/10 hover:text-primary"
                  aria-label="Close message"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                      Email
                    </p>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="mt-1 block text-sm font-medium text-primary hover:underline"
                    >
                      {
                        selectedMessage.email
                      }
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {
                        selectedMessage.phone ||
                        "Not provided"
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                      Subject
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {
                        selectedMessage.subject ||
                        "No subject"
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                      Received
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {formatDate(
                        selectedMessage.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                    Status
                  </p>

                  <select
                    value={
                      selectedMessage.status
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        selectedMessage._id,
                        event.target
                          .value
                      )
                    }
                    className="mt-2 rounded-lg border border-primary/20 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="new">
                      New
                    </option>

                    <option value="read">
                      Read
                    </option>

                    <option value="replied">
                      Replied
                    </option>
                  </select>
                </div>

                <div className="rounded-2xl bg-primary/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text/40">
                    Message
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text/80">
                    {
                      selectedMessage.message
                    }
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      selectedMessage.subject
                        ? `Re: ${selectedMessage.subject}`
                        : "Response from Bhavani's Art World"
                    )}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary-light"
                  >
                    <FiMail
                      size={16}
                    />
                    Reply by Email
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMessage(
                        null
                      )
                    }
                    className="rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminMessages;