import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/useToast';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUploadFile } from '@/hooks/useUploadFile';
import { MISSING_REPORT_KIND } from '@/lib/types';

const formSchema = z.object({
  kind: z.enum(['person', 'animal'], {
    required_error: 'Please select whether this is a person or animal',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  lastSeen: z.string().min(5, {
    message: 'Please provide when they were last seen.',
  }),
  location: z.string().min(3, {
    message: 'Please provide a location.',
  }),
  contactInfo: z.string().min(5, {
    message: 'Please provide contact information.',
  }),
});

export function CreateReportForm() {
  const { toast } = useToast();
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kind: 'person',
      name: '',
      description: '',
      lastSeen: '',
      location: '',
      contactInfo: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[_, url]] = await uploadFile(file);
      setImageUrl(url);
      toast({
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image.',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You must be logged in to create a report.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        ...values,
        imageUrl,
      };

      publishEvent({
        kind: MISSING_REPORT_KIND,
        content: JSON.stringify(reportData),
        tags: [
          ['t', 'missing'],
          ['t', values.kind],
        ],
      }, {
        onSuccess: (event) => {
          toast({
            title: 'Report created',
            description: 'Your missing report has been published.',
          });
          navigate(`/report/${event.id}`);
        },
        onError: (error) => {
          console.error('Failed to publish report:', error);
          toast({
            title: 'Failed to create report',
            description: 'There was an error publishing your report.',
            variant: 'destructive',
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating your report.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Missing Report</CardTitle>
          <CardDescription>You must be logged in to create a report.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Missing Report</CardTitle>
        <CardDescription>
          Fill out this form to report a missing person or animal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="person" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Person
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="animal" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Animal
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the missing person or animal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include details like age, height, weight, clothing, distinctive features, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastSeen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Seen</FormLabel>
                  <FormControl>
                    <Input placeholder="When were they last seen?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Include the date, time, and circumstances.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where were they last seen?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide the city, area, or specific location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="How can people contact you?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide phone numbers, email, or other contact methods.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Photo (Optional)</FormLabel>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <FormDescription>
                Upload a clear, recent photo if available.
              </FormDescription>
              {imageUrl && (
                <div className="mt-2">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-48 rounded-md object-cover" 
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Creating Report...' : 'Create Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Please ensure all information is accurate and up-to-date.
      </CardFooter>
    </Card>
  );
}