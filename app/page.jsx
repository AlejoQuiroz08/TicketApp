import TicketCard from '@/components/TicketCard';

const formatDateAndTime = (rawTimeAndDate) => {
  const formated = new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: 'numeric',
    hour12: false,
  })
    .format(new Date(new Date(rawTimeAndDate).getTime() + 1000 * 60 * 60 * 2))
    ?.split(',')
    ?.reverse()
    ?.join(' | ');

  return formated;
};

const getTickets = async (role) => {
  try {
    const res = await fetch('https://ticket-app-rouge.vercel.app/api/Tickets', {
      cache: 'no-store',
    });
    const data = await res.json();

    // Filtrar tickets según el rol
    if (role === 'User') {
      // Si el rol es "Usuario", filtra para solo mostrar tickets del usuario actual
      const userTickets = data.tickets.filter(ticket => ticket.userId === 'currentUserId');
      data.tickets = userTickets;
    }

    data.tickets.map((ticket) => {
      ticket.date = formatDateAndTime(ticket.createdAt);
      ticket.lastUpdate = formatDateAndTime(ticket.updatedAt);
      return ticket;
    });

    return data;
  } catch (error) {
    console.log('Failed to get tickets ', error);
  }
};

const Dashboard = async () => {
  // Obtener el rol desde el contexto del usuario (esto es un ejemplo, debes reemplazarlo con la lógica de tu aplicación)
  const role = 'User'; // Esto puede ser 'Admin' o 'User' según el rol del usuario logueado
  const { tickets } = (await getTickets(role)) || {};

  // Obtener categorías únicas
  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      <div>
        {tickets && uniqueCategories?.map((uniqueCategory, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <h2 className="mb-4">{uniqueCategory}</h2>
            <div className="lg:grid grid-cols-2 xl:grid-cols-4">
              {tickets
                .filter((ticket) => ticket.category === uniqueCategory)
                .map((filteredTicket, _index) => (
                  <TicketCard
                    key={_index}
                    ticket={filteredTicket}
                    role={role} // Pasamos el rol al componente TicketCard para posibles funcionalidades adicionales
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Si el rol es Admin, agregar funcionalidad de administración */}
      {role === 'Admin' && (
        <div className="mt-5">
          <h3 className="text-xl">Administrar Tickets</h3>
          {/* Aquí puedes agregar botones o formularios para crear, editar o eliminar tickets */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
