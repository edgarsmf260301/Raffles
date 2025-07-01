const sendToWhatsapp = (formData, selectedTickets, totalPrice) => {
    const ticketNumbers = selectedTickets.map(ticket => ticket.ticketNumber).join(', ');
    const whatsappMessage = `Hola, me gustaría enviar el comprobante de pago. Aquí están mis datos:
    - Cédula: ${formData.id}
    - Nombre: ${formData.name}
    - Teléfono: ${formData.phoneCode}${formData.phone}
    - Estado: ${formData.state}
    - Método de Pago: ${formData.paymentMethod}
    - Tickets Seleccionados: ${ticketNumbers}
    - Precio Total: ${totalPrice}`;
  
    const whatsappUrl = `https://wa.me/+584126557778?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  export default sendToWhatsapp;