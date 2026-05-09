import { useEffect, useMemo, useState } from 'react';
import { MdCalendarToday, MdPets, MdAttachMoney, MdWarning } from 'react-icons/md';
import { useSession } from '../../contexts/SessionContext';
import StatCard from '../../components/StatCard/StatCard';
import { schedulingService, type Scheduling } from '../../services/scheduling';
import { petsService, type Pet } from '../../services/pets.service';
import { financialService, type Transaction } from '../../services/financial';
import { productsService, type Product } from '../../services/products.service';
import { employeeService } from '../../services/employee';
import { tutorService } from '../../services/tutor.service';
import styles from './Dashboard.module.css';

interface DashboardBooking {
  id: string;
  petName: string;
  tutorName: string;
  employeeName: string;
  status: string;
  dateTime: string;
  avatarUrl?: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Dashboard() {
  const { session } = useSession();
  const clinicId = session?.clinicId || '';
  const firstName = session?.name?.split(' ')[0] || 'Usuário';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalSchedulings, setTotalSchedulings] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [stockAlerts, setStockAlerts] = useState(0);
  const [nextBookings, setNextBookings] = useState<DashboardBooking[]>([]);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      setError('');

      try {
        const [schedulings, pets, transactions, products, employees, tutors] = await Promise.all([
          schedulingService.list(),
          petsService.getAll(),
          clinicId ? financialService.getAll(clinicId) : Promise.resolve([] as Transaction[]),
          productsService.getAll(),
          employeeService.getAll(),
          tutorService.getAll(),
        ]);

        const now = new Date();

        const currentMonthRevenue = transactions
          .filter((transaction: Transaction) => {
            const transactionDate = new Date(transaction.created_at);
            return (
              transaction.amount > 0 &&
              transactionDate.getMonth() === now.getMonth() &&
              transactionDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

        const alertCount = products.filter((product: Product) => product.stock <= 5).length;

        const petNames = new Map(pets.map((pet: Pet) => [pet.id, pet.name]));
        const petAvatars = new Map(pets.map((pet: Pet) => [pet.id, pet.photo_url]));
        const employeeNames = new Map(employees.map((e) => [e.id, e.name]));
        const tutorNames = new Map(tutors.map((t) => [t.id, t.name]));

        const upcoming = schedulings
          .slice()
          .sort((a: Scheduling, b: Scheduling) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
          .filter((item: Scheduling) => new Date(item.dateTime) >= now)
          .slice(0, 4)
          .map((item: Scheduling) => ({
            id: item.id,
            petName: petNames.get(item.petId) || 'Pet desconhecido',
            tutorName: tutorNames.get(item.tutorId) || '',
            employeeName: employeeNames.get(item.employeeId) || '',
            status: item.status,
            dateTime: item.dateTime,
            avatarUrl: petAvatars.get(item.petId),
          }));

        setTotalSchedulings(schedulings.length);
        setTotalPets(pets.length);
        setMonthlyRevenue(currentMonthRevenue);
        setStockAlerts(alertCount);
        setNextBookings(upcoming);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Erro ao carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [clinicId]);

  const metrics = useMemo(
    () => [
      {
        icon: <MdCalendarToday />,
        label: 'Agendamentos',
        value: totalSchedulings,
        subtitle: 'Total de agendamentos',
      },
      {
        icon: <MdPets />,
        label: 'Pets cadastrados',
        value: totalPets,
        subtitle: 'Total de pets no sistema',
      },
      {
        icon: <MdAttachMoney />,
        label: 'Receita mensal',
        value: formatCurrency(monthlyRevenue),
        subtitle: 'Mês atual',
      },
      {
        icon: <MdWarning />,
        label: 'Alertas de estoque',
        value: stockAlerts,
        subtitle: stockAlerts > 0 ? `${stockAlerts} produtos abaixo do mínimo` : 'Sem alertas',
        subtitleColor: stockAlerts > 0 ? 'danger' : 'success',
      },
    ],
    [stockAlerts, totalPets, totalSchedulings, monthlyRevenue],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Que bom te ver, {firstName}!</h1>
      </div>

      {loading ? (
        <div className={styles.loader}>Carregando métricas...</div>
      ) : (
        <>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.cards}>
            {metrics.map((metric) => (
              <StatCard
                key={metric.label}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                subtitle={metric.subtitle}
                subtitleColor={metric.subtitleColor as 'success' | 'danger' | 'default'}
              />
            ))}
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.title}>Próximos agendamentos</h2>
                <p className={styles.sectionDescription}>Os próximos itens da agenda com base nos dados atuais.</p>
              </div>
              <a href="/agendamentos" className={styles.sectionLink}>
                Ver agenda completa
              </a>
            </div>

            {nextBookings.length === 0 ? (
              <div className={styles.emptyState}>Nenhum agendamento futuro encontrado.</div>
            ) : (
              <ul className={styles.bookingList}>
                {nextBookings.map((booking) => (
                  <li key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingLeft}>
                      {booking.avatarUrl ? (
                        <img src={booking.avatarUrl} alt={booking.petName} className={styles.bookingAvatar} />
                      ) : (
                        <div className={styles.bookingAvatarPlaceholder}>
                          {getInitials(booking.petName)}
                        </div>
                      )}
                      <div className={styles.bookingInfo}>
                        <span className={styles.bookingTitle}>{booking.petName}</span>
                        <span className={styles.bookingSubtitle}>
                        {booking.tutorName && <><b>Tutor:</b> {booking.tutorName}</>}
                        {booking.tutorName && booking.employeeName && ' · '}
                        {booking.employeeName && <><b>Funcionário:</b> {booking.employeeName}</>}
                      </span>
                      </div>
                    </div>

                    <div className={styles.bookingMiddle}>
                      <span className={styles.bookingBadge}>{booking.status}</span>
                    </div>

                    <div className={styles.bookingMeta}>
                      <span className={styles.bookingDate}>{formatTime(booking.dateTime)}</span>
                      <span className={styles.bookingTime}>{formatDateTime(booking.dateTime)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}