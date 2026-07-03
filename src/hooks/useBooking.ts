/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useToast } from "../contexts/ToastContext.js";
import { getStoredState, initialAdminSettings } from "../data/adminStore.js";

export function useBooking() {
  const toast = useToast();

  const handleBookConsultation = () => {
    const settings = getStoredState("settings", initialAdminSettings);
    const calendlyLink = settings?.calendlyLink;

    if (calendlyLink && calendlyLink.trim() !== "") {
      window.open(calendlyLink, "_blank");
    } else {
      toast.error(
        "Consultation booking is temporarily unavailable. Please contact us.",
        "Booking Unavailable"
      );
    }
  };

  return { handleBookConsultation };
}
