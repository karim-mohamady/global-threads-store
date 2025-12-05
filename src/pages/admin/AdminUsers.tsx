import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.users.getAll({
        page,
        per_page: 10,
        search: search || undefined,
      });
      setUsers(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load users" : "فشل تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === "en" ? "Delete this user?" : "حذف هذا المستخدم؟")) {
      return;
    }

    try {
      await adminApi.users.delete(id);
      toast({
        title: language === "en" ? "User deleted" : "تم حذف المستخدم",
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message || (language === "en" ? "Failed to delete user" : "فشل حذف المستخدم"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Users" : "المستخدمين"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Manage user accounts" : "إدارة حسابات المستخدمين"}
          </p>
        </div>
        <Button className="btn-gold">
          <UserPlus className="h-4 w-4 me-2" />
          {language === "en" ? "Add User" : "إضافة مستخدم"}
        </Button>
      </div>

      <Card className="card-luxury">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "en" ? "Search users..." : "بحث عن مستخدمين..."}
              className="ps-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {language === "en" ? "No users found" : "لا يوجد مستخدمين"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "en" ? "User" : "المستخدم"}</TableHead>
                      <TableHead>{language === "en" ? "Email" : "البريد"}</TableHead>
                      <TableHead>{language === "en" ? "Role" : "الدور"}</TableHead>
                      <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                      <TableHead>{language === "en" ? "Joined" : "التسجيل"}</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-accent/10 text-accent text-xs">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "destructive"}>
                            {user.is_active
                              ? language === "en"
                                ? "Active"
                                : "نشط"
                              : language === "en"
                              ? "Inactive"
                              : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString(
                            language === "ar" ? "ar-EG" : "en-US"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 me-2" />
                                {language === "en" ? "Edit" : "تعديل"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                {language === "en" ? "Delete" : "حذف"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    {language === "en" ? "Previous" : "السابق"}
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    {language === "en" ? "Next" : "التالي"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
